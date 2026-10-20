import type { Request, Response, NextFunction } from "express";
import { verificarTokenHemocentro } from "../service/HemocentroAuthService";

export function autenticarHemocentro(req: Request, res: Response, next: NextFunction) {
    const header = req.header("Authorization");
    const token = header?.startsWith("Bearer ") ? header.slice(7) : "";
    const hemocentroId = verificarTokenHemocentro(token);
    if (!hemocentroId) return res.status(401).json({ message: "Sessão do hemocentro inválida ou expirada" });
    res.locals.hemocentroId = hemocentroId;
    next();
}

export function conferirHemocentroDaRota(req: Request, res: Response, next: NextFunction) {
    if (Number(req.params.hemocentroId) !== res.locals.hemocentroId) {
        return res.status(403).json({ message: "Acesso negado a este hemocentro" });
    }
    next();
}
