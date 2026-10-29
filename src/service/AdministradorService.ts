import { prisma } from "../config/prisma";
import { EstoqueService } from "./EstoqueService";
import { HemocentroService } from "./HemocentroService";
import { VagaService } from "./VagaService";
import type { StatusAgendamento } from "../dto/AgendamentoDTO";

const campos = { id: true, nome: true, endereco: true, latitude: true, longitude: true, status: true, decididoEm: true,
    conta: { select: { email: true } } } as const;

function idValido(id: number) {
    if (!Number.isInteger(id) || id <= 0) throw new Error("Id inválido");
}

export class AdministradorService {
    private readonly estoque = new EstoqueService();
    private readonly vagas = new VagaService();
    private readonly agendamentos = new HemocentroService();

    listarSolicitacoes() {
        return prisma.hemocentro.findMany({ where: { status: "PENDENTE" }, select: campos, orderBy: { id: "desc" } });
    }

    listarHemocentros() {
        return prisma.hemocentro.findMany({ where: { status: { in: ["APROVADO", "DESATIVADO"] } }, select: campos, orderBy: { nome: "asc" } });
    }

    async decidir(id: number, decisao: unknown) {
        idValido(id);
        if (decisao !== "APROVADO" && decisao !== "RECUSADO") throw new Error("Decisão inválida");
        const alterado = await prisma.hemocentro.updateMany({ where: { id, status: "PENDENTE" }, data: { status: decisao, decididoEm: new Date() } });
        if (alterado.count !== 1) throw new Error("Solicitação inexistente ou já decidida");
        return prisma.hemocentro.findUnique({ where: { id }, select: campos });
    }

    async editar(id: number, dados: Record<string, unknown>) {
        idValido(id);
        const atual = await prisma.hemocentro.findUnique({ where: { id }, select: { status: true } });
        if (!atual || !["APROVADO", "DESATIVADO"].includes(atual.status)) throw new Error("Hemocentro não encontrado");
        const nome = typeof dados.nome === "string" ? dados.nome.trim() : "";
        const endereco = typeof dados.endereco === "string" ? dados.endereco.trim() : "";
        const latitude = dados.latitude;
        const longitude = dados.longitude;
        if (nome.length < 3 || endereco.length < 8 || typeof latitude !== "number" || !Number.isFinite(latitude) || latitude < -90 || latitude > 90
            || typeof longitude !== "number" || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) throw new Error("Informe nome, endereço e coordenadas válidas");
        return prisma.hemocentro.update({ where: { id }, data: { nome, endereco, latitude, longitude }, select: campos });
    }

    async alterarAtivacao(id: number, status: unknown) {
        idValido(id);
        if (status !== "APROVADO" && status !== "DESATIVADO") throw new Error("Status inválido");
        const anterior = status === "APROVADO" ? "DESATIVADO" : "APROVADO";
        const alterado = await prisma.hemocentro.updateMany({ where: { id, status: anterior }, data: { status } });
        if (alterado.count !== 1) throw new Error("Hemocentro não encontrado ou status já alterado");
        return prisma.hemocentro.findUnique({ where: { id }, select: campos });
    }

    async garantirCentro(id: number) {
        idValido(id);
        const centro = await prisma.hemocentro.findUnique({ where: { id }, select: { status: true } });
        if (!centro || centro.status !== "APROVADO") throw new Error("Hemocentro ativo não encontrado");
    }

    async listarEstoque(id: number) { await this.garantirCentro(id); return this.estoque.listar(id); }
    async movimentarEstoque(id: number, dados: Parameters<EstoqueService["movimentar"]>[1]) { await this.garantirCentro(id); return this.estoque.movimentar(id, dados); }
    async listarVagas(id: number) { await this.garantirCentro(id); return this.vagas.listar(id); }
    async abrirVaga(id: number, dados: Parameters<VagaService["abrir"]>[1]) { await this.garantirCentro(id); return this.vagas.abrir(id, dados); }
    async alterarVaga(id: number, vagaId: number, capacidade: number) { await this.garantirCentro(id); return this.vagas.alterarCapacidade(id, vagaId, capacidade); }
    async listarAgendamentos(id: number) { await this.garantirCentro(id); return this.agendamentos.listarAgendamentos(id, {}); }
    async alterarAgendamento(id: number, agendamentoId: number, status: StatusAgendamento) {
        await this.garantirCentro(id);
        return this.agendamentos.atualizarStatusAgendamento(id, agendamentoId, status);
    }
}
