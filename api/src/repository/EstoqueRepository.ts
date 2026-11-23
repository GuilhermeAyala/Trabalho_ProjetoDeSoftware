import { prisma } from "../config/prisma";
import { nivelDoEstoque, TIPOS_SANGUINEOS, type MovimentarEstoqueDTO } from "../dto/EstoqueDTO";

export class EstoqueRepository {
    private garantirTipos(hemocentroId: number) {
        return prisma.estoque.createMany({
            data: TIPOS_SANGUINEOS.map((tipoSanguineo) => ({
                hemocentroId,
                tipoSanguineo,
                quantidade: 0,
                nivel: "ESGOTADO",
            })),
            skipDuplicates: true,
        });
    }

    async listar(hemocentroId: number) {
        // Repara registros antigos sem alterar quantidades já existentes.
        await this.garantirTipos(hemocentroId);
        return prisma.estoque.findMany({
            where: { hemocentroId }, orderBy: { tipoSanguineo: "asc" },
            select: { id: true, tipoSanguineo: true, quantidade: true, nivel: true },
        });
    }

    listarMovimentacoes(hemocentroId: number) {
        return prisma.movimentacaoEstoque.findMany({
            where: { estoque: { hemocentroId } },
            orderBy: { criadaEm: "desc" }, take: 50,
            select: { id: true, tipo: true, quantidade: true, motivo: true, criadaEm: true,
                estoque: { select: { tipoSanguineo: true } } },
        });
    }

    async movimentar(hemocentroId: number, dados: MovimentarEstoqueDTO) {
        return prisma.$transaction(async (tx) => {
            const estoque = await tx.estoque.upsert({
                where: { hemocentroId_tipoSanguineo: { hemocentroId, tipoSanguineo: dados.tipoSanguineo } },
                create: { hemocentroId, tipoSanguineo: dados.tipoSanguineo, quantidade: 0, nivel: "ESGOTADO" },
                update: {},
            });
            const quantidadeNova = estoque.quantidade + (dados.tipo === "ENTRADA" ? dados.quantidade : -dados.quantidade);
            if (quantidadeNova < 0) throw new Error("Quantidade insuficiente no estoque");
            const atualizado = await tx.estoque.updateMany({
                where: { id: estoque.id, hemocentroId, quantidade: estoque.quantidade },
                data: { quantidade: quantidadeNova, nivel: nivelDoEstoque(quantidadeNova) },
            });
            if (atualizado.count !== 1) throw new Error("Estoque alterado simultaneamente. Tente novamente");
            await tx.movimentacaoEstoque.create({
                data: { estoqueId: estoque.id, tipo: dados.tipo, quantidade: dados.quantidade, motivo: dados.motivo },
            });
            return tx.estoque.findUniqueOrThrow({
                where: { id: estoque.id }, select: { id: true, tipoSanguineo: true, quantidade: true, nivel: true },
            });
        });
    }
}
