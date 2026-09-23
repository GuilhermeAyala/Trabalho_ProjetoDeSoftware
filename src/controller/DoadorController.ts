import { Request, Response } from "express";
import { DoadorService } from "../service/DoadorService";
import type { DoadorDTO } from "../dto/DoadorDTO";

export class DoadorController {
    public doadorService: DoadorService;

    constructor(){
        this.doadorService = new DoadorService();
    }

    async criarDoador(req: Request, res: Response){
        try {
            const dadosDoador: DoadorDTO = req.body;
            const doador = await this.doadorService.criarDoador(dadosDoador);

            return res.status(201).json({
                message: "Doador criado com sucesso",
                doador,
            });
        } catch (error) {
            return res.status(400).json({ message: this.getErrorMessage(error) });
        }
    }

    async atualizarDoador(req: Request, res: Response){
        try {
            const id = Number(req.params.id);
            const dadosDoador: DoadorDTO = req.body;

            if(Number.isNaN(id)){
                return res.status(400).json({ message: "Id inválido" });
            }

            const doador = await this.doadorService.atualizarDoador(id, dadosDoador);

            return res.status(200).json({
                message: "Doador atualizado com sucesso",
                doador,
            });
        } catch (error) {
            return res.status(400).json({ message: this.getErrorMessage(error) });
        }
    }

    async deletarDoador(req: Request, res: Response){
        try {
            const id = Number(req.params.id);

            if(Number.isNaN(id)){
                return res.status(400).json({ message: "Id inválido" });
            }

            await this.doadorService.deletarDoador(id);

            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ message: this.getErrorMessage(error) });
        }
    }

    async buscarDoador(req: Request, res: Response){
        try {
            const id = Number(req.params.id);

            if(Number.isNaN(id)){
                return res.status(400).json({ message: "Id inválido" });
            }

            const doador = await this.doadorService.buscarDoador(id);

            if(!doador){
                return res.status(404).json({ message: "Doador não encontrado" });
            }

            return res.status(200).json(doador);
        } catch (error) {
            return res.status(400).json({ message: this.getErrorMessage(error) });
        }
    }

    async listarDoadores(_req: Request, res: Response){
        try {
            const doadores = await this.doadorService.listarDoadores();

            return res.status(200).json(doadores);
        } catch (error) {
            return res.status(400).json({ message: this.getErrorMessage(error) });
        }
    }

    private getErrorMessage(error: unknown): string {
        if(error instanceof Error){
            return error.message;
        }

        return "Erro inesperado";
    }
}
