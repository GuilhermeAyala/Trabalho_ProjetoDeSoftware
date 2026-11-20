import type { Request, Response, NextFunction } from "express";
import { verificarTokenHemocentro } from "../service/HemocentroAuthService";
import { prisma } from "../config/prisma";

export async function autenticarHemocentro(req: Request, res: Response, next: NextFunction) {
    const header = req.header("Authorization");
    const token = header?.startsWith("Bearer ") ? header.slice(7) : "";
    const hemocentroId = verificarTokenHemocentro(token);
    if (!hemocentroId) return res.status(401).json({ message: "Sessão do hemocentro inválida ou expirada" });
    const hemocentro = await prisma.hemocentro.findUnique({ where: { id: hemocentroId }, select: { status: true } });
    if (hemocentro?.status !== "APROVADO") return res.status(403).json({ message: "Acesso do hemocentro indisponível" });
    res.locals.hemocentroId = hemocentroId;
    next();
}

export function conferirHemocentroDaRota(req: Request, res: Response, next: NextFunction) {
    if (Number(req.params.hemocentroId) !== res.locals.hemocentroId) {
        return res.status(403).json({ message: "Acesso negado a este hemocentro" });
    }
    next();
}
