import type { Request, Response } from "express";
import { EstoqueService } from "../service/EstoqueService";
import { HemocentroAuthService } from "../service/HemocentroAuthService";
import { HemocentroService } from "../service/HemocentroService";

export class HemocentroPortalController {
    constructor(
        private readonly auth = new HemocentroAuthService(),
        private readonly estoque = new EstoqueService(),
        private readonly hemocentros = new HemocentroService(),
    ) {}

    async cadastrar(req: Request, res: Response) {
        try {
            const resultado = await this.auth.cadastrar(req.body);
            return res.status(201).json(resultado);
        } catch (error) { return this.erro(res, error); }
    }

    async entrar(req: Request, res: Response) {
        try {
            return res.status(200).json(await this.auth.entrar(req.body?.email, req.body?.senha));
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erro inesperado";
            return res.status(message === "E-mail ou senha inválidos" ? 401 : 400).json({ message });
        }
    }

    async perfil(_req: Request, res: Response) {
        const hemocentro = await this.hemocentros.buscarHemocentro(res.locals.hemocentroId);
        return hemocentro ? res.json(hemocentro) : res.status(404).json({ message: "Hemocentro não encontrado" });
    }

    async listarEstoque(_req: Request, res: Response) {
        try { return res.json(await this.estoque.listar(res.locals.hemocentroId)); }
        catch (error) { return this.erro(res, error); }
    }

    async historicoEstoque(_req: Request, res: Response) {
        try { return res.json(await this.estoque.historico(res.locals.hemocentroId)); }
        catch (error) { return this.erro(res, error); }
    }

    async movimentarEstoque(req: Request, res: Response) {
        try {
            const estoque = await this.estoque.movimentar(res.locals.hemocentroId, req.body);
            return res.status(200).json({ message: "Estoque atualizado", estoque });
        } catch (error) { return this.erro(res, error); }
    }

    private erro(res: Response, error: unknown) {
        const message = error instanceof Error ? error.message : "Erro inesperado";
        const status = message.includes("já cadastrado") || message.includes("simultaneamente") ? 409 : 400;
        return res.status(status).json({ message });
    }
}
