import { prisma } from "../config/prisma";
import type {
    FiltrosAgendamentoHemocentroDTO,
    StatusAgendamento,
} from "../dto/AgendamentoDTO";

export class AgendamentoRepository {
    /**
     * Campos necessários para o atendimento no hemocentro. Dados como CPF,
     * senha, nascimento e respostas clínicas não são expostos nesta consulta.
     */
    private readonly camposParaHemocentro = {
        id: true,
        data: true,
        horario: true,
        status: true,
        criadoEm: true,
        doadorId: true,
        hemocentroId: true,
        vagaId: true,
        doador: {
            select: {
                id: true,
                nome: true,
                email: true,
                tipoSanguineo: true,
            },
        },
    } as const;

    async doadorJaPossuiAgendamento(
        doadorId: number,
        hemocentroId: number,
        data: Date,
        horario: string,
    ) {
        const agendamento = await prisma.agendamento.findFirst({
            where: {
                doadorId,
                hemocentroId,
                data,
                horario,
                status: { in: ["AGENDADO", "CONFIRMADO"] },
            },
            select: { id: true },
        });

        return agendamento !== null;
    }

    async salvar(doadorId: number, hemocentroId: number, data: Date, horario: string) {
        return prisma.$transaction(async (tx) => {
            const vaga = await tx.vaga.findUnique({
                where: { hemocentroId_data_horario: { hemocentroId, data, horario } },
            });
            if (!vaga) throw new Error("O hemocentro não abriu vaga para este horário");
            if (vaga.reservadas >= vaga.capacidade) throw new Error("Não há vagas disponíveis neste horário");
            const duplicado = await tx.agendamento.findFirst({
                where: { doadorId, hemocentroId, data, horario, status: { in: ["AGENDADO", "CONFIRMADO"] } },
                select: { id: true },
            });
            if (duplicado) throw new Error("O doador já possui este agendamento");
            const reserva = await tx.vaga.updateMany({
                where: { id: vaga.id, reservadas: vaga.reservadas },
                data: { reservadas: { increment: 1 } },
            });
            if (reserva.count !== 1) throw new Error("Vaga alterada simultaneamente. Tente novamente");
            return tx.agendamento.create({
                data: { doadorId, hemocentroId, data, horario, vagaId: vaga.id },
                select: {
                    id: true, data: true, horario: true, status: true, criadoEm: true, doadorId: true,
                    hemocentro: { select: { id: true, nome: true, endereco: true } },
                },
            });
        });
    }

    async listarPorDoador(doadorId: number) {
        return prisma.agendamento.findMany({
            where: { doadorId },
            orderBy: [{ data: "asc" }, { horario: "asc" }],
            select: {
                id: true,
                data: true,
                horario: true,
                status: true,
                criadoEm: true,
                doadorId: true,
                hemocentro: {
                    select: {
                        id: true,
                        nome: true,
                        endereco: true,
                    },
                },
            },
        });
    }

    /**
     * hemocentroId é obrigatório no filtro: consultar o hemocentro 1 nunca
     * retorna agendamentos vinculados ao hemocentro 2.
     */
    async listarPorHemocentro(
        hemocentroId: number,
        filtros: FiltrosAgendamentoHemocentroDTO,
    ) {
        return prisma.agendamento.findMany({
            where: {
                hemocentroId,
                ...(filtros.status ? { status: filtros.status } : {}),
                ...(filtros.dataInicio || filtros.dataFim
                    ? {
                        data: {
                            ...(filtros.dataInicio ? { gte: filtros.dataInicio } : {}),
                            ...(filtros.dataFim ? { lte: filtros.dataFim } : {}),
                        },
                    }
                    : {}),
            },
            orderBy: [{ data: "asc" }, { horario: "asc" }],
            select: this.camposParaHemocentro,
        });
    }

    /**
     * A busca combina o id do recurso e o hemocentro proprietário. Um id de
     * outro hemocentro resulta em null, sem revelar os dados do agendamento.
     */
    async buscarPorIdDoHemocentro(hemocentroId: number, agendamentoId: number) {
        return prisma.agendamento.findFirst({
            where: {
                id: agendamentoId,
                hemocentroId,
            },
            select: this.camposParaHemocentro,
        });
    }

    /**
     * A propriedade também é aplicada na escrita. count igual a zero indica
     * que o registro não existe ou pertence a outro hemocentro.
     */
    async atualizarStatusDoHemocentro(
        hemocentroId: number,
        agendamentoId: number,
        statusAtual: string,
        status: StatusAgendamento,
        doadorId: number,
        pontosPorDoacao: number,
        vagaId: number | null,
    ) {
        await prisma.$transaction(async (tx) => {
            const resultado = await tx.agendamento.updateMany({
                where: { id: agendamentoId, hemocentroId, status: statusAtual },
                data: { status },
            });
            if (resultado.count === 0) {
                throw new Error("Agendamento alterado simultaneamente. Atualize a agenda");
            }
            if (status === "REALIZADO" && statusAtual !== "REALIZADO") {
                await tx.doador.update({
                    where: { id: doadorId },
                    data: { pontosDoacao: { increment: pontosPorDoacao } },
                });
            }
            if (status === "CANCELADO" && statusAtual !== "CANCELADO" && vagaId !== null) {
                await tx.vaga.update({ where: { id: vagaId }, data: { reservadas: { decrement: 1 } } });
            }
        });
        return this.buscarPorIdDoHemocentro(hemocentroId, agendamentoId);
    }
}
