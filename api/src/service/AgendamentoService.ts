import type { AgendarDoacaoDTO } from "../dto/AgendamentoDTO";
import { AgendamentoRepository } from "../repository/AgendamentoRepository";
import { DoadorService } from "./DoadorService";
import { HemocentroService } from "./HemocentroService";

export class AgendamentoService {
    constructor(
        private readonly agendamentoRepository = new AgendamentoRepository(),
        private readonly doadorService = new DoadorService(),
        private readonly hemocentroService = new HemocentroService(),
    ) {}

    async agendarDoacao(dados: AgendarDoacaoDTO) {
        if (!dados || typeof dados !== "object") {
            throw new Error("Os dados do agendamento são obrigatórios");
        }

        this.validarIds(dados);
        const data = this.converterEValidarData(dados.data, dados.horario);

        // As existências são verificadas no service, mantendo as regras do caso
        // de uso fora do controller e as consultas SQL dentro dos repositories.
        const [doador, hemocentro] = await Promise.all([
            this.doadorService.buscarDoador(dados.doadorId),
            this.hemocentroService.buscarHemocentro(dados.hemocentroId),
        ]);

        if (!doador) throw new Error("Doador não encontrado");
        if (!hemocentro) throw new Error("Hemocentro não encontrado");

        const agendamentoDuplicado = await this.agendamentoRepository.doadorJaPossuiAgendamento(
            dados.doadorId,
            dados.hemocentroId,
            data,
            dados.horario,
        );

        if (agendamentoDuplicado) {
            throw new Error("O doador já possui este agendamento");
        }

        return this.agendamentoRepository.salvar(
            dados.doadorId,
            dados.hemocentroId,
            data,
            dados.horario,
        );
    }

    async listarAgendamentosDoDoador(doadorId: number) {
        if (!Number.isInteger(doadorId) || doadorId <= 0) {
            throw new Error("Id do doador inválido");
        }

        return this.agendamentoRepository.listarPorDoador(doadorId);
    }

    private validarIds(dados: AgendarDoacaoDTO) {
        if (!Number.isInteger(dados.doadorId) || dados.doadorId <= 0) {
            throw new Error("Id do doador inválido");
        }

        if (!Number.isInteger(dados.hemocentroId) || dados.hemocentroId <= 0) {
            throw new Error("Id do hemocentro inválido");
        }
    }

    private converterEValidarData(dataInformada: string, horario: string) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dataInformada)) {
            throw new Error("A data deve estar no formato YYYY-MM-DD");
        }

        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(horario)) {
            throw new Error("O horário deve estar no formato HH:mm");
        }

        const data = new Date(`${dataInformada}T00:00:00.000Z`);
        if (Number.isNaN(data.getTime()) || data.toISOString().slice(0, 10) !== dataInformada) {
            throw new Error("Data inválida");
        }

        const instanteDoAgendamento = new Date(`${dataInformada}T${horario}:00`);
        if (instanteDoAgendamento.getTime() <= Date.now()) {
            throw new Error("O agendamento deve ser realizado para uma data e horário futuros");
        }

        return data;
    }
}
