import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { prisma } from "../config/prisma";

const validadeTokenMs = 12 * 60 * 60 * 1000;
const camposPublicos = { id: true, nome: true, email: true, sexo: true, tipoSanguineo: true, pontosDoacao: true } as const;

async function buscarPerfilPublico(doadorId: number) {
    const doador = await prisma.doador.findUniqueOrThrow({
        where: { id: doadorId },
        select: {
            ...camposPublicos,
            _count: {
                select: {
                    agendamento: { where: { status: "REALIZADO" } },
                },
            },
        },
    });
    const { _count, ...perfil } = doador;
    return { ...perfil, doacoesRealizadas: _count.agendamento };
}

function segredo() {
    const valor = process.env.HEMOCENTRO_AUTH_SECRET;
    if (!valor || valor.length < 32) throw new Error("HEMOCENTRO_AUTH_SECRET deve ter pelo menos 32 caracteres");
    return valor;
}

function hashSenha(senha: string) {
    const salt = randomBytes(16).toString("hex");
    return `${salt}:${scryptSync(senha, salt, 64).toString("hex")}`;
}

function senhaConfere(senha: string, hash: string) {
    const [salt, esperadoHex] = hash.split(":");
    if (!salt || !esperadoHex) return false;
    const esperado = Buffer.from(esperadoHex, "hex");
    const recebido = scryptSync(senha, salt, esperado.length);
    return esperado.length === recebido.length && timingSafeEqual(esperado, recebido);
}

function emitirToken(doadorId: number) {
    const payload = Buffer.from(JSON.stringify({ doadorId, exp: Date.now() + validadeTokenMs })).toString("base64url");
    const assinatura = createHmac("sha256", segredo()).update(payload).digest("base64url");
    return `${payload}.${assinatura}`;
}

export function verificarTokenDoador(token: string): number | null {
    const partes = token.split(".");
    if (partes.length !== 2) return null;
    const [payload, assinatura] = partes;
    if (!payload || !assinatura) return null;
    try {
        const esperado = createHmac("sha256", segredo()).update(payload).digest();
        const recebido = Buffer.from(assinatura, "base64url");
        if (esperado.length !== recebido.length || !timingSafeEqual(esperado, recebido)) return null;
        const dados: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
        if (!dados || typeof dados !== "object") return null;
        const { doadorId, exp } = dados as Record<string, unknown>;
        return Number.isInteger(doadorId) && Number(doadorId) > 0 && typeof exp === "number" && exp > Date.now()
            ? Number(doadorId) : null;
    } catch { return null; }
}

export class DoadorAuthService {
    async cadastrar(dados: Record<string, unknown>) {
        const nome = typeof dados.nome === "string" ? dados.nome.trim() : "";
        const email = typeof dados.email === "string" ? dados.email.trim().toLowerCase() : "";
        const senha = typeof dados.password === "string" ? dados.password : "";
        const cpf = typeof dados.cpf === "string" ? dados.cpf.replace(/\D/g, "") : "";
        const sexo = dados.sexo;
        const tipoSanguineo = dados.tipoSanguineo;
        const nascimento = typeof dados.DataNascimento === "string" ? new Date(dados.DataNascimento) : new Date(NaN);
        if (nome.length < 3) throw new Error("Informe seu nome completo");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("E-mail inválido");
        if (senha.length < 8) throw new Error("A senha deve ter pelo menos 8 caracteres");
        if (cpf.length !== 11) throw new Error("Informe um CPF válido com 11 dígitos");
        if (Number.isNaN(nascimento.getTime()) || nascimento >= new Date()) throw new Error("Data de nascimento inválida");
        if (!["Masculino", "Feminino", "Não identificar"].includes(String(sexo))) throw new Error("Selecione uma opção de sexo válida");
        if (!["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(String(tipoSanguineo))) throw new Error("Selecione um tipo sanguíneo válido");
        segredo();
        if (await prisma.doador.findFirst({ where: { email } })) throw new Error("E-mail já cadastrado");
        if (await prisma.doador.findFirst({ where: { cpf } })) throw new Error("CPF já cadastrado");
        const doador = await prisma.doador.create({
            data: { nome, email, password: hashSenha(senha), cpf, sexo: String(sexo), tipoSanguineo: String(tipoSanguineo), DataNascimento: nascimento },
            select: camposPublicos,
        });
        return { doador: { ...doador, doacoesRealizadas: 0 }, token: emitirToken(doador.id) };
    }

    async entrar(emailInformado: unknown, senha: unknown) {
        if (typeof emailInformado !== "string" || typeof senha !== "string") throw new Error("E-mail ou senha inválidos");
        const doador = await prisma.doador.findFirst({ where: { email: emailInformado.trim().toLowerCase() } });
        if (!doador) throw new Error("E-mail ou senha inválidos");
        if (!senhaConfere(senha, doador.password)) {
            // Contas de demonstração e cadastros legados podem ainda ter senha
            // em texto puro; migra para scrypt no primeiro login válido.
            if (doador.password !== senha || doador.password.includes(":")) throw new Error("E-mail ou senha inválidos");
            await prisma.doador.update({ where: { id: doador.id }, data: { password: hashSenha(senha) } });
        }
        const perfil = await buscarPerfilPublico(doador.id);
        return { doador: perfil, token: emitirToken(perfil.id) };
    }
}
