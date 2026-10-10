import { prisma } from "../src/config/prisma";

// O frontend usa o doador 1 enquanto não existe autenticação. Este registro
// fictício torna o Compose demonstrável logo após o primeiro `up`.
const EMAIL_DOADOR_DEMONSTRACAO = "doador.demo@vitta.local";

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

criarDoadorDemonstracao()
    .catch((error: unknown) => {
        console.error("Não foi possível criar o doador de demonstração.", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
