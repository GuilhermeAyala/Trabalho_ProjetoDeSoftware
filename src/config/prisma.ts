import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL não está configurada.");
}

function obterConexaoPostgres(urlConfigurada: string) {
    if (!urlConfigurada.startsWith("prisma+postgres://")) {
        return urlConfigurada;
    }

    // O Prisma local guarda a URL PostgreSQL direta dentro do api_key. A CLI
    // entende prisma+postgres, mas o driver pg precisa da conexão direta.
    const apiKey = new URL(urlConfigurada).searchParams.get("api_key");
    if (!apiKey) {
        throw new Error("A URL local do Prisma não possui api_key.");
    }

    const configuracaoLocal = JSON.parse(
        Buffer.from(apiKey, "base64url").toString("utf8"),
    ) as { databaseUrl?: unknown };

    if (typeof configuracaoLocal.databaseUrl !== "string") {
        throw new Error("Não foi possível obter a conexão PostgreSQL local.");
    }

    return configuracaoLocal.databaseUrl;
}

// Uma única instância é compartilhada pelos repositories. Assim, cada módulo
// não abre sua própria conexão com o PostgreSQL.
const adapter = new PrismaPg({ connectionString: obterConexaoPostgres(connectionString) });

export const prisma = new PrismaClient({ adapter });
