const prefixo = "vitta";

export const cacheKeys = {
    agendamentosDoador: (doadorId: number) => `${prefixo}:agendamentos:doador:${doadorId}`,
    agendamentosHemocentro: (
        hemocentroId: number,
        status: string | undefined,
        dataInicio: Date | undefined,
        dataFim: Date | undefined,
    ) => [
        prefixo,
        "agendamentos",
        "hemocentro",
        hemocentroId,
        status ?? "todos",
        dataInicio?.toISOString() ?? "inicio",
        dataFim?.toISOString() ?? "fim",
    ].join(":"),
    agendamentosHemocentroPadrao: (hemocentroId: number) =>
        `${prefixo}:agendamentos:hemocentro:${hemocentroId}:*`,
    ultimaTriagemDoador: (doadorId: number) => `${prefixo}:triagens:doador:${doadorId}:ultima`,
    vagasHemocentro: (hemocentroId: number, apenasDisponiveis: boolean) =>
        `${prefixo}:vagas:hemocentro:${hemocentroId}:${apenasDisponiveis ? "disponiveis" : "todas"}`,
};

export async function invalidarAgendamentos(
    cache: typeof import("./RedisCache").redisCache,
    doadorId: number,
    hemocentroId: number,
) {
    await Promise.all([
        cache.remover(cacheKeys.agendamentosDoador(doadorId)),
        cache.removerPorPadrao(cacheKeys.agendamentosHemocentroPadrao(hemocentroId)),
    ]);
}

export async function invalidarVagas(
    cache: typeof import("./RedisCache").redisCache,
    hemocentroId: number,
) {
    await cache.remover(
        cacheKeys.vagasHemocentro(hemocentroId, false),
        cacheKeys.vagasHemocentro(hemocentroId, true),
    );
}
