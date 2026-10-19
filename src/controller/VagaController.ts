import type { Request, Response } from "express";
import { VagaService } from "../service/VagaService";

export class VagaController {
    constructor(private readonly service = new VagaService()) {}

    async listarPublico(req: Request, res: Response) {
        try { return res.json(await this.service.listar(Number(req.params.id), true)); }
        catch (error) { return this.erro(res, error); }
    }

    async listar(_req: Request, res: Response) {
        try { return res.json(await this.service.listar(res.locals.hemocentroId)); }
        catch (error) { return this.erro(res, error); }
    }

    async abrir(req: Request, res: Response) {
        try { return res.status(201).json(await this.service.abrir(res.locals.hemocentroId, req.body)); }
        catch (error) { return this.erro(res, error); }
    }

    async alterar(req: Request, res: Response) {
        try { return res.json(await this.service.alterarCapacidade(res.locals.hemocentroId, Number(req.params.vagaId), req.body?.capacidade)); }
        catch (error) { return this.erro(res, error); }
    }

    private erro(res: Response, error: unknown) {
        const message = error instanceof Error ? error.message : "Erro inesperado";
        return res.status(message.includes("Já existe") ? 409 : 400).json({ message });
    }
}
