import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "../config/prisma";
import { senhaConfere } from "./HemocentroAuthService";

function segredoAdmin() {
    const segredo = process.env.HEMOCENTRO_AUTH_SECRET;
    if (!segredo || segredo.length < 32) throw new Error("HEMOCENTRO_AUTH_SECRET deve ter pelo menos 32 caracteres");
    return `administrador:${segredo}`;
}

export function emitirTokenAdmin(id: number) {
    const payload = Buffer.from(JSON.stringify({ id, exp: Date.now() + 12 * 60 * 60 * 1000 })).toString("base64url");
    const assinatura = createHmac("sha256", segredoAdmin()).update(payload).digest("base64url");
    return `${payload}.${assinatura}`;
}

export function verificarTokenAdmin(token: string) {
    const [payload, assinatura, extra] = token.split(".");
    if (!payload || !assinatura || extra) return null;
    const esperado = createHmac("sha256", segredoAdmin()).update(payload).digest();
    const recebido = Buffer.from(assinatura, "base64url");
    if (esperado.length !== recebido.length || !timingSafeEqual(esperado, recebido)) return null;
    try {
        const dados: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
        if (!dados || typeof dados !== "object") return null;
        const { id, exp } = dados as Record<string, unknown>;
        return Number.isInteger(id) && Number(id) > 0 && typeof exp === "number" && exp > Date.now() ? Number(id) : null;
    } catch { return null; }
}

export async function loginAdmin(email: unknown, senha: unknown) {
    if (typeof email !== "string" || typeof senha !== "string") throw new Error("E-mail ou senha inválidos");
    const admin = await prisma.administrador.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!admin || !senhaConfere(senha, admin.senhaHash)) throw new Error("E-mail ou senha inválidos");
    return { token: emitirTokenAdmin(admin.id), email: admin.email };
}
