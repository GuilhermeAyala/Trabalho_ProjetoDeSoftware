import { prisma } from "../config/prisma";

export class HemocentroRepository {
    // O repository apenas acessa os dados. Ordenação por distância pertence
    // ao service, pois é uma regra do caso de uso e não do banco.
    async listar() {
        return prisma.hemocentro.findMany({
            select: {
                id: true,
                nome: true,
                endereco: true,
                latitude: true,
                longitude: true,
            },
            orderBy: { nome: "asc" },
        });
    }

    async buscarPorId(id: number) {
        return prisma.hemocentro.findUnique({
            where: { id },
            select: {
                id: true,
                nome: true,
                endereco: true,
                latitude: true,
                longitude: true,
            },
        });
    }
}
