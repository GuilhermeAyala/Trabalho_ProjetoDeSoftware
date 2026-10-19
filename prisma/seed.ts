import { prisma } from "../src/config/prisma";

// O frontend usa o doador 1 enquanto não existe autenticação. Este registro
// fictício torna o Compose demonstrável logo após o primeiro `up`.
const EMAIL_DOADOR_DEMONSTRACAO = "doador.demo@vitta.local";

const HEMOCENTROS_DEMONSTRACAO = [
    {
        nome: "Hemocentro Central",
        endereco: "Setor Médico Hospitalar Norte, Brasília - DF",
        latitude: -15.77972,
        longitude: -47.92972,
    },
    {
        nome: "Hemocentro Asa Sul",
        endereco: "Asa Sul, Brasília - DF",
        latitude: -15.82343,
        longitude: -47.92549,
    },
] as const;

async function criarDoadorDemonstracao() {
    const doadorExistente = await prisma.doador.findFirst({
        where: { email: EMAIL_DOADOR_DEMONSTRACAO },
        select: { id: true },
    });

    if (doadorExistente) {
        console.log("Doador de demonstração já existe.");
        return;
    }

    await prisma.doador.create({
        data: {
            nome: "Doador Demonstração",
            email: EMAIL_DOADOR_DEMONSTRACAO,
            DataNascimento: new Date("1995-01-01T00:00:00.000Z"),
            // Dados exclusivamente fictícios para o banco Docker local.
            password: "senha-demonstracao",
            cpf: "00000000000",
            sexo: "Não identificar",
            tipoSanguineo: "O+",
        },
        select: { id: true },
    });

    console.log("Doador de demonstração criado.");
}

/**
 * Garante dados suficientes para demonstrar proximidade e isolamento entre
 * hemocentros. A busca anterior à criação torna o seed repetível.
 */
async function criarHemocentrosDemonstracao() {
    for (const dados of HEMOCENTROS_DEMONSTRACAO) {
        const existente = await prisma.hemocentro.findFirst({
            where: {
                nome: dados.nome,
                endereco: dados.endereco,
            },
            select: { id: true },
        });

        if (!existente) {
            await prisma.hemocentro.create({ data: dados });
        }
    }

    console.log("Hemocentros de demonstração disponíveis.");
}

Promise.all([
    criarDoadorDemonstracao(),
    criarHemocentrosDemonstracao(),
])
    .catch((error: unknown) => {
        console.error("Não foi possível preparar os dados de demonstração.", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
