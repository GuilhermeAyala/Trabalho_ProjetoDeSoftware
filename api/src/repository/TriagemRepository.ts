import { prisma } from "../config/prisma";
import { cacheKeys, invalidarAgendamentos, invalidarVagas } from "../cache/CacheKeys";
import { redisCache } from "../cache/RedisCache";
import type { RespostasTriagemDTO } from "../dto/TriagemDTO";

export class TriagemRepository {
    async salvar(
        doadorId: number,
        respostas: RespostasTriagemDTO,
        apto: boolean,
        motivosInaptidao: string[],
    ) {
        const triagem = await prisma.triagem.create({
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
                agendamentoId: true,
                apto: true,
                motivosInaptidao: true,
                realizadaEm: true,
            },
        });
        await redisCache.salvar(cacheKeys.ultimaTriagemDoador(doadorId), {
            id: triagem.id,
            doadorId: triagem.doadorId,
            apto: triagem.apto,
            realizadaEm: triagem.realizadaEm,
        });
        return triagem;
    }

    async salvarParaAgendamento(
        doadorId: number,
        agendamentoId: number,
        respostas: RespostasTriagemDTO,
        apto: boolean,
        motivosInaptidao: string[],
    ) {
        const resultado = await prisma.$transaction(async (tx) => {
            const agendamento = await tx.agendamento.findFirst({
                where: { id: agendamentoId, doadorId },
                select: { id: true, status: true, vagaId: true, hemocentroId: true },
            });

            if (!agendamento) {
                throw new Error("Agendamento não encontrado para este doador");
            }
            if (agendamento.status !== "AGUARDANDO_TRIAGEM") {
                throw new Error("A triagem deste agendamento já foi concluída ou ele não está mais ativo");
            }

            const novoStatus = apto ? "AGENDADO" : "CANCELADO";
            const alteracao = await tx.agendamento.updateMany({
                where: {
                    id: agendamento.id,
                    doadorId,
                    status: "AGUARDANDO_TRIAGEM",
                },
                data: { status: novoStatus },
            });
            if (alteracao.count !== 1) {
                throw new Error("Agendamento alterado simultaneamente. Atualize a agenda");
            }

            if (!apto && agendamento.vagaId !== null) {
                const liberacao = await tx.vaga.updateMany({
                    where: { id: agendamento.vagaId, reservadas: { gt: 0 } },
                    data: { reservadas: { decrement: 1 } },
                });
                if (liberacao.count !== 1) {
                    throw new Error("Não foi possível liberar a vaga do agendamento");
                }
            }

            const triagem = await tx.triagem.create({
                data: {
                    doadorId,
                    agendamentoId,
                    ...respostas,
                    apto,
                    motivosInaptidao,
                },
                select: {
                    id: true,
                    doadorId: true,
                    agendamentoId: true,
                    apto: true,
                    motivosInaptidao: true,
                    realizadaEm: true,
                },
            });

            return {
                triagem: { ...triagem, agendamentoCancelado: !apto },
                hemocentroId: agendamento.hemocentroId,
            };
        });

        await Promise.all([
            redisCache.salvar(cacheKeys.ultimaTriagemDoador(doadorId), {
                id: resultado.triagem.id,
                doadorId: resultado.triagem.doadorId,
                apto: resultado.triagem.apto,
                realizadaEm: resultado.triagem.realizadaEm,
            }),
            invalidarAgendamentos(redisCache, doadorId, resultado.hemocentroId),
            !apto ? invalidarVagas(redisCache, resultado.hemocentroId) : Promise.resolve(),
        ]);
        return resultado.triagem;
    }

    async buscarUltimaPorDoador(doadorId: number) {
        return redisCache.buscarOuCarregar(cacheKeys.ultimaTriagemDoador(doadorId), () => prisma.triagem.findFirst({
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
        }));
    }
}
