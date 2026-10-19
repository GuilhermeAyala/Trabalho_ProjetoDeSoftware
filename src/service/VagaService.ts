import { prisma } from "../config/prisma";

function converterData(data: unknown, horario: unknown) {
    if (typeof data !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data)) throw new Error("Data deve estar no formato YYYY-MM-DD");
    if (typeof horario !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(horario)) throw new Error("Horário deve estar no formato HH:mm");
    const dataBanco = new Date(`${data}T00:00:00.000Z`);
    if (Number.isNaN(dataBanco.getTime()) || dataBanco.toISOString().slice(0, 10) !== data) throw new Error("Data inválida");
    if (new Date(`${data}T${horario}:00`).getTime() <= Date.now()) throw new Error("A vaga deve ser futura");
    return dataBanco;
}

export class VagaService {
    listar(hemocentroId: number, apenasDisponiveis = false) {
        if (!Number.isInteger(hemocentroId) || hemocentroId <= 0) throw new Error("Id do hemocentro inválido");
        return prisma.vaga.findMany({
            where: { hemocentroId, data: { gte: new Date(new Date().toISOString().slice(0, 10) + "T00:00:00.000Z") } },
            orderBy: [{ data: "asc" }, { horario: "asc" }],
            select: { id: true, hemocentroId: true, data: true, horario: true, capacidade: true, reservadas: true },
        }).then((vagas) => apenasDisponiveis
            ? vagas.filter((vaga) => vaga.reservadas < vaga.capacidade && new Date(`${vaga.data.toISOString().slice(0, 10)}T${vaga.horario}:00`).getTime() > Date.now())
            : vagas);
    }

    async abrir(hemocentroId: number, dados: { data: string; horario: string; capacidade: number }) {
        const data = converterData(dados?.data, dados?.horario);
        if (!Number.isInteger(dados.capacidade) || dados.capacidade <= 0 || dados.capacidade > 100) {
            throw new Error("Capacidade deve ser um inteiro entre 1 e 100");
        }
        try {
            return await prisma.vaga.create({
                data: { hemocentroId, data, horario: dados.horario, capacidade: dados.capacidade },
                select: { id: true, hemocentroId: true, data: true, horario: true, capacidade: true, reservadas: true },
            });
        } catch (error) {
            if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
                throw new Error("Já existe vaga para esta data e horário");
            }
            throw error;
        }
    }

    async alterarCapacidade(hemocentroId: number, vagaId: number, capacidade: number) {
        if (!Number.isInteger(vagaId) || vagaId <= 0) throw new Error("Id da vaga inválido");
        if (!Number.isInteger(capacidade) || capacidade <= 0 || capacidade > 100) throw new Error("Capacidade deve ser um inteiro entre 1 e 100");
        const resultado = await prisma.vaga.updateMany({
            where: { id: vagaId, hemocentroId, reservadas: { lte: capacidade } },
            data: { capacidade },
        });
        if (resultado.count !== 1) throw new Error("Vaga inexistente ou capacidade menor que as reservas atuais");
        return prisma.vaga.findUnique({ where: { id: vagaId } });
    }
}
