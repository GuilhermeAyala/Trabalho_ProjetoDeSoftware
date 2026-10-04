import { prisma } from "../config/prisma";
import type { RespostasTriagemDTO } from "../dto/TriagemDTO";

export class TriagemRepository {
    async salvar(
        doadorId: number,
        respostas: RespostasTriagemDTO,
        apto: boolean,
        motivosInaptidao: string[],
    ) {
        return prisma.triagem.create({
            data: {
                doadorId,
                ...respostas,
                apto,
                motivosInaptidao,
            },
            // A resposta não devolve todas as respostas de saúde ao front.
            // O app recebe somente o resultado necessário para continuar o fluxo.
            select: {
                id: true,
                doadorId: true,
                apto: true,
                motivosInaptidao: true,
                realizadaEm: true,
            },
        });
    }

    async buscarUltimaPorDoador(doadorId: number) {
        return prisma.triagem.findFirst({
            where: { doadorId },
            orderBy: { realizadaEm: "desc" },
            // A consulta posterior expõe somente o estado geral. Os motivos e
            // respostas de saúde não trafegam novamente pela API.
            select: {
                id: true,
                doadorId: true,
                apto: true,
                realizadaEm: true,
            },
        });
    }
}
