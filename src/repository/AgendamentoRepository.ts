import { prisma } from "../config/prisma";

export class AgendamentoRepository {
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
                status: "AGENDADO",
            },
            select: { id: true },
        });

        return agendamento !== null;
    }

    async salvar(doadorId: number, hemocentroId: number, data: Date, horario: string) {
        return prisma.agendamento.create({
            data: {
                doadorId,
                hemocentroId,
                data,
                horario,
            },
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
}
