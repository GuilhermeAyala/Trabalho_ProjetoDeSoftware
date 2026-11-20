import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { verificarTokenAdmin } from "../service/AdministradorAuthService";

export async function autenticarAdmin(req: Request, res: Response, next: NextFunction) {
    const header = req.header("Authorization");
    const id = verificarTokenAdmin(header?.startsWith("Bearer ") ? header.slice(7) : "");
    if (!id) return res.status(401).json({ message: "Sessão do administrador inválida ou expirada" });
    const admin = await prisma.administrador.findUnique({ where: { id }, select: { id: true } });
    if (!admin) return res.status(401).json({ message: "Administrador não encontrado" });
    next();
}
