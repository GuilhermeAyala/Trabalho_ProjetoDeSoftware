import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { prisma } from "../config/prisma";
import { TIPOS_SANGUINEOS } from "../dto/EstoqueDTO";

interface CadastroHemocentro {
    nome: string;
    endereco: string;
    latitude: number;
    longitude: number;
    email: string;
    senha: string;
}

const validadeTokenMs = 12 * 60 * 60 * 1000;

function segredo() {
    const valor = process.env.HEMOCENTRO_AUTH_SECRET;
    if (!valor || valor.length < 32) {
        throw new Error("HEMOCENTRO_AUTH_SECRET deve ter pelo menos 32 caracteres");
    }
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

function emitirToken(hemocentroId: number) {
    const payload = Buffer.from(JSON.stringify({ hemocentroId, exp: Date.now() + validadeTokenMs })).toString("base64url");
    const assinatura = createHmac("sha256", segredo()).update(payload).digest("base64url");
    return `${payload}.${assinatura}`;
}

export function verificarTokenHemocentro(token: string): number | null {
    const partes = token.split(".");
    if (partes.length !== 2) return null;
    const [payload, assinatura] = partes;
    if (!payload || !assinatura) return null;
    const esperada = createHmac("sha256", segredo()).update(payload).digest();
    const recebida = Buffer.from(assinatura, "base64url");
    if (esperada.length !== recebida.length || !timingSafeEqual(esperada, recebida)) return null;
    try {
        const dados: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
        if (!dados || typeof dados !== "object") return null;
        const { hemocentroId, exp } = dados as Record<string, unknown>;
        return Number.isInteger(hemocentroId) && Number(hemocentroId) > 0
            && typeof exp === "number" && exp > Date.now() ? Number(hemocentroId) : null;
    } catch {
        return null;
    }
}

export class HemocentroAuthService {
    async cadastrar(dados: CadastroHemocentro) {
        if (!dados || typeof dados !== "object") throw new Error("Dados do hemocentro são obrigatórios");
        const nome = typeof dados.nome === "string" ? dados.nome.trim() : "";
        const endereco = typeof dados.endereco === "string" ? dados.endereco.trim() : "";
        const email = typeof dados.email === "string" ? dados.email.trim().toLowerCase() : "";
        if (nome.length < 3 || endereco.length < 8) throw new Error("Informe nome e endereço completos");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("E-mail inválido");
        if (typeof dados.senha !== "string" || dados.senha.length < 8) throw new Error("A senha deve ter pelo menos 8 caracteres");
        if (typeof dados.latitude !== "number" || !Number.isFinite(dados.latitude)
            || dados.latitude < -90 || dados.latitude > 90) throw new Error("Latitude inválida");
        if (typeof dados.longitude !== "number" || !Number.isFinite(dados.longitude)
            || dados.longitude < -180 || dados.longitude > 180) throw new Error("Longitude inválida");
        // Verifica a configuração antes de persistir: sem chave não pode existir
        // cadastro concluído que não consiga emitir a sessão correspondente.
        segredo();

        try {
            const hemocentro = await prisma.hemocentro.create({
                data: {
                    nome, endereco, latitude: dados.latitude, longitude: dados.longitude,
                    conta: { create: { email, senhaHash: hashSenha(dados.senha) } },
                    estoque: {
                        create: TIPOS_SANGUINEOS.map((tipoSanguineo) => ({
                            tipoSanguineo, quantidade: 0, nivel: "ESGOTADO",
                        })),
                    },
                },
                select: { id: true, nome: true, endereco: true, latitude: true, longitude: true },
            });
            return { hemocentro, token: emitirToken(hemocentro.id) };
        } catch (error) {
            if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
                throw new Error("E-mail já cadastrado para um hemocentro");
            }
            throw error;
        }
    }

    async entrar(emailInformado: unknown, senha: unknown) {
        if (typeof emailInformado !== "string" || typeof senha !== "string") {
            throw new Error("E-mail ou senha inválidos");
        }
        const conta = await prisma.hemocentroConta.findUnique({
            where: { email: emailInformado.trim().toLowerCase() },
            include: { hemocentro: { select: { id: true, nome: true, endereco: true, latitude: true, longitude: true } } },
        });
        if (!conta || !senhaConfere(senha, conta.senhaHash)) throw new Error("E-mail ou senha inválidos");
        return { hemocentro: conta.hemocentro, token: emitirToken(conta.hemocentroId) };
    }
}
