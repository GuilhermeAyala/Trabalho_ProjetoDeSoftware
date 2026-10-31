import { prisma } from "../config/prisma";
import { cpfEstaCriptografado, criptografarCpf } from "../security/CpfEncryption";

export async function migrarCpfsLegados() {
    const doadores = await prisma.doador.findMany({
        select: { id: true, cpf: true },
    });
    const legados = doadores.filter(({ cpf }) => !cpfEstaCriptografado(cpf));
    if (legados.length === 0) return 0;

    const atualizacoes = legados.map(({ id, cpf }) => prisma.doador.update({
        where: { id },
        data: { cpf: criptografarCpf(cpf) },
        select: { id: true },
    }));
    await prisma.$transaction(atualizacoes);
    return legados.length;
}
