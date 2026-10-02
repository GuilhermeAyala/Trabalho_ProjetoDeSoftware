import type { Request, Response } from "express";
import type { AgendarDoacaoDTO } from "../dto/AgendamentoDTO";
import { AgendamentoService } from "../service/AgendamentoService";

export class AgendamentoController {
    constructor(private readonly agendamentoService = new AgendamentoService()) {}

    async agendar(req: Request, res: Response) {
        try {
            const dados: AgendarDoacaoDTO = req.body;
            const agendamento = await this.agendamentoService.agendarDoacao(dados);

            return res.status(201).json({
                message: "Doação agendada com sucesso",
                agendamento,
            });
        } catch (error) {
            return res.status(400).json({ message: this.getErrorMessage(error) });
        }
    }

    async listarPorDoador(req: Request, res: Response) {
        try {
            const agendamentos = await this.agendamentoService.listarAgendamentosDoDoador(
                Number(req.params.doadorId),
            );

            return res.status(200).json(agendamentos);
        } catch (error) {
            return res.status(400).json({ message: this.getErrorMessage(error) });
        }
    }

    private getErrorMessage(error: unknown) {
        return error instanceof Error ? error.message : "Erro inesperado";
    }
}
