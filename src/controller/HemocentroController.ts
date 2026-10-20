import type { Request, Response } from "express";
import {
    STATUS_AGENDAMENTO,
    type FiltrosAgendamentoHemocentroDTO,
    type StatusAgendamento,
} from "../dto/AgendamentoDTO";
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

    async listarAgendamentos(req: Request, res: Response) {
        try {
            const filtros: FiltrosAgendamentoHemocentroDTO = {};

            if (req.query.status !== undefined) {
                filtros.status = this.converterStatus(req.query.status);
            }
            if (req.query.dataInicio !== undefined) {
                filtros.dataInicio = this.converterData(req.query.dataInicio, "dataInicio");
            }
            if (req.query.dataFim !== undefined) {
                filtros.dataFim = this.converterData(req.query.dataFim, "dataFim");
            }

            const agendamentos = await this.hemocentroService.listarAgendamentos(
                Number(req.params.hemocentroId ?? res.locals.hemocentroId),
                filtros,
            );

            return res.status(200).json(agendamentos);
        } catch (error) {
            return this.responderErro(res, error);
        }
    }

    async buscarAgendamento(req: Request, res: Response) {
        try {
            const agendamento = await this.hemocentroService.buscarAgendamento(
                Number(req.params.hemocentroId ?? res.locals.hemocentroId),
                Number(req.params.agendamentoId),
            );

            // Recurso inexistente e recurso de outro hemocentro produzem a
            // mesma resposta para não revelar dados de outro domínio.
            if (!agendamento) {
                return res.status(404).json({ message: "Agendamento não encontrado" });
            }

            return res.status(200).json(agendamento);
        } catch (error) {
            return this.responderErro(res, error);
        }
    }

    async atualizarStatusAgendamento(req: Request, res: Response) {
        try {
            const status = this.converterStatus(req.body?.status);
            const agendamento = await this.hemocentroService.atualizarStatusAgendamento(
                Number(req.params.hemocentroId ?? res.locals.hemocentroId),
                Number(req.params.agendamentoId),
                status,
            );

            if (!agendamento) {
                return res.status(404).json({ message: "Agendamento não encontrado" });
            }

            return res.status(200).json({
                message: "Status do agendamento atualizado com sucesso",
                agendamento,
            });
        } catch (error) {
            return this.responderErro(res, error);
        }
    }

    private converterStatus(valor: unknown): StatusAgendamento {
        if (
            typeof valor !== "string"
            || !STATUS_AGENDAMENTO.includes(valor as StatusAgendamento)
        ) {
            throw new Error(`Status inválido. Use: ${STATUS_AGENDAMENTO.join(", ")}`);
        }

        return valor as StatusAgendamento;
    }

    private converterData(valor: unknown, nome: string) {
        if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
            throw new Error(`${nome} deve estar no formato YYYY-MM-DD`);
        }

        const data = new Date(`${valor}T00:00:00.000Z`);
        if (Number.isNaN(data.getTime()) || data.toISOString().slice(0, 10) !== valor) {
            throw new Error(`${nome} inválida`);
        }

        return data;
    }

    private responderErro(res: Response, error: unknown) {
        const message = this.getErrorMessage(error);
        const status = message.includes("não encontrado") ? 404
            : message.includes("simultaneamente") ? 409 : 400;
        return res.status(status).json({ message });
    }

    private getErrorMessage(error: unknown) {
        return error instanceof Error ? error.message : "Erro inesperado";
    }
}
