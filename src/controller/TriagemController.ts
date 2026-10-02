import type { Request, Response } from "express";
import type { RealizarTriagemDTO } from "../dto/TriagemDTO";
import { TriagemService } from "../service/TriagemService";

export class TriagemController {
    constructor(private readonly triagemService = new TriagemService()) {}

    async realizar(req: Request, res: Response) {
        try {
            const dados: RealizarTriagemDTO = req.body;
            const resultado = await this.triagemService.realizarTriagem(dados);

            return res.status(201).json({
                message: resultado.apto
                    ? "Pré-triagem concluída: apto para continuar o fluxo"
                    : "Pré-triagem concluída: procure o hemocentro para orientação",
                aviso: "O resultado não substitui a triagem clínica presencial.",
                resultado,
            });
        } catch (error) {
            return res.status(400).json({ message: this.getErrorMessage(error) });
        }
    }

    async buscarUltima(req: Request, res: Response) {
        try {
            const triagem = await this.triagemService.buscarUltimaTriagem(
                Number(req.params.doadorId),
            );

            if (!triagem) {
                return res.status(404).json({ message: "Nenhuma triagem encontrada" });
            }

            return res.status(200).json(triagem);
        } catch (error) {
            return res.status(400).json({ message: this.getErrorMessage(error) });
        }
    }

    private getErrorMessage(error: unknown) {
        return error instanceof Error ? error.message : "Erro inesperado";
    }
}
