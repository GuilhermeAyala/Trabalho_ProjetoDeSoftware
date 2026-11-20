import { prisma } from "../config/prisma";
import { nivelDoEstoque, type MovimentarEstoqueDTO } from "../dto/EstoqueDTO";

export class EstoqueRepository {
    listar(hemocentroId: number) {
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
            const estoque = await tx.estoque.findUnique({
                where: { hemocentroId_tipoSanguineo: { hemocentroId, tipoSanguineo: dados.tipoSanguineo } },
            });
            if (!estoque) throw new Error("Estoque não encontrado");
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
