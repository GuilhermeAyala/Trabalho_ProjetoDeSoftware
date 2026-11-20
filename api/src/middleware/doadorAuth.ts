import type { NextFunction, Request, Response } from "express";
import { verificarTokenDoador } from "../service/DoadorAuthService";

export type RequestComDoador = Request & { doadorIdAutenticado?: number };

export function exigirDoador(req: Request, res: Response, next: NextFunction) {
    const token = req.header("Authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return res.status(401).json({ message: "Sessão do doador necessária" });
    const doadorId = verificarTokenDoador(token);
    if (!doadorId) return res.status(401).json({ message: "Sessão inválida ou expirada" });
    const request = req as RequestComDoador;
    const idsInformados = [req.params.id, req.params.doadorId, req.body?.doadorId]
        .filter((value) => value !== undefined)
        .map(Number);
    if (idsInformados.some((id) => id !== doadorId)) return res.status(403).json({ message: "Acesso não autorizado a outro doador" });
    request.doadorIdAutenticado = doadorId;
    next();
}
