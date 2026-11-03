import { createClient } from "redis";

const TTL_PADRAO_SEGUNDOS = 60;

let cliente: ReturnType<typeof createClient> | null = null;
let conexaoEmAndamento: Promise<void> | null = null;

function obterCliente() {
    if (cliente) return cliente;

    cliente = createClient({
        url: process.env.REDIS_URL ?? "redis://localhost:6379",
        // Impede que uma consulta fique aguardando em fila quando o Redis cai.
        // Nesse caso, os helpers seguem imediatamente para o PostgreSQL.
        disableOfflineQueue: true,
    });
    cliente.on("error", (error) => {
        console.warn("Redis indisponível; a API continuará usando o PostgreSQL.", error.message);
    });
    return cliente;
}

function ttlPadrao() {
    const configurado = Number(process.env.REDIS_CACHE_TTL_SECONDS);
    return Number.isInteger(configurado) && configurado > 0
        ? configurado
        : TTL_PADRAO_SEGUNDOS;
}

export async function conectarRedis() {
    const redis = obterCliente();
    if (redis.isReady) return true;

    if (!conexaoEmAndamento) {
        conexaoEmAndamento = redis.connect()
            .then(() => undefined)
            .finally(() => {
                conexaoEmAndamento = null;
            });
    }

    try {
        await conexaoEmAndamento;
        console.log("Redis conectado como camada de cache.");
        return true;
    } catch (error) {
        console.warn(
            "Não foi possível conectar ao Redis; o PostgreSQL seguirá atendendo as consultas.",
            error instanceof Error ? error.message : error,
        );
        return false;
    }
}

export async function encerrarRedis() {
    if (cliente?.isOpen) await cliente.quit();
}

export async function verificarRedis() {
    if (!cliente?.isReady) return false;
    try {
        return await cliente.ping() === "PONG";
    } catch {
        return false;
    }
}

class RedisCache {
    async buscarOuCarregar<T>(chave: string, carregarDoPostgres: () => Promise<T>): Promise<T> {
        const redis = obterCliente();

        if (redis.isReady) {
            try {
                const valor = await redis.get(chave);
                if (valor !== null) return JSON.parse(valor) as T;
            } catch (error) {
                console.warn(`Falha ao ler a chave ${chave} do Redis.`, error);
            }
        }

        const valorDoPostgres = await carregarDoPostgres();
        await this.salvar(chave, valorDoPostgres);
        return valorDoPostgres;
    }

    async salvar(chave: string, valor: unknown) {
        const redis = obterCliente();
        if (!redis.isReady) return;

        try {
            await redis.set(chave, JSON.stringify(valor), { EX: ttlPadrao() });
        } catch (error) {
            console.warn(`Falha ao gravar a chave ${chave} no Redis.`, error);
        }
    }

    async remover(...chaves: string[]) {
        const redis = obterCliente();
        if (!redis.isReady || chaves.length === 0) return;

        try {
            await redis.del(chaves);
        } catch (error) {
            console.warn("Falha ao invalidar chaves do Redis.", error);
        }
    }

    async removerPorPadrao(padrao: string) {
        const redis = obterCliente();
        if (!redis.isReady) return;

        try {
            for await (const chaves of redis.scanIterator({ MATCH: padrao, COUNT: 100 })) {
                if (chaves.length > 0) await redis.del(chaves);
            }
        } catch (error) {
            console.warn(`Falha ao invalidar o padrão ${padrao} no Redis.`, error);
        }
    }
}

export const redisCache = new RedisCache();
