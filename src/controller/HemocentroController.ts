import type { Request, Response } from "express";
import { HemocentroService } from "../service/HemocentroService";

export class HemocentroController {
    constructor(private readonly hemocentroService = new HemocentroService()) {}

    async listar(req: Request, res: Response) {
        try {
            const possuiLatitude = req.query.latitude !== undefined;
            const possuiLongitude = req.query.longitude !== undefined;

            if (possuiLatitude !== possuiLongitude) {
                return res.status(400).json({
                    message: "Latitude e longitude devem ser informadas juntas",
                });
            }

            const coordenadas = possuiLatitude && possuiLongitude
                ? {
                    latitude: Number(req.query.latitude),
                    longitude: Number(req.query.longitude),
                }
                : undefined;

            const hemocentros = await this.hemocentroService.listarHemocentros(coordenadas);
            return res.status(200).json(hemocentros);
        } catch (error) {
            return res.status(400).json({ message: this.getErrorMessage(error) });
        }
    }

    async buscarPorId(req: Request, res: Response) {
        try {
            const hemocentro = await this.hemocentroService.buscarHemocentro(Number(req.params.id));

            if (!hemocentro) {
                return res.status(404).json({ message: "Hemocentro não encontrado" });
            }

            return res.status(200).json(hemocentro);
        } catch (error) {
            return res.status(400).json({ message: this.getErrorMessage(error) });
        }
    }

    private getErrorMessage(error: unknown) {
        return error instanceof Error ? error.message : "Erro inesperado";
    }
}
