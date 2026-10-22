import {
    STATUS_AGENDAMENTO,
    type FiltrosAgendamentoHemocentroDTO,
    type StatusAgendamento,
} from "../dto/AgendamentoDTO";
import type { CoordenadasDTO, HemocentroDTO } from "../dto/HemocentroDTO";
import { AgendamentoRepository } from "../repository/AgendamentoRepository";
import { HemocentroRepository } from "../repository/HemocentroRepository";
import { DoadorService } from "./DoadorService";

export class HemocentroService {
    constructor(
        private readonly hemocentroRepository = new HemocentroRepository(),
        private readonly agendamentoRepository = new AgendamentoRepository(),
    ) {}

    async listarHemocentros(coordenadas?: CoordenadasDTO): Promise<HemocentroDTO[]> {
        const hemocentros = await this.hemocentroRepository.listar();

        if (!coordenadas) {
            return hemocentros;
        }

        this.validarCoordenadas(coordenadas);

        // A distância é calculada no service para manter o repository dedicado
        // somente à persistência. A API de mapas pode substituir este cálculo depois.
        return hemocentros
            .map((hemocentro) => ({
                ...hemocentro,
                distanciaKm: Number(this.calcularDistanciaKm(coordenadas, hemocentro).toFixed(2)),
            }))
            .sort((a, b) => a.distanciaKm - b.distanciaKm);
    }

    async buscarHemocentro(id: number) {
        this.validarId(id);
        return this.hemocentroRepository.buscarPorId(id);
    }

    /**
     * Lista somente os agendamentos pertencentes ao hemocentro recebido.
     * Filtros opcionais nunca substituem o filtro obrigatório de propriedade.
     */
    async listarAgendamentos(
        hemocentroId: number,
        filtros: FiltrosAgendamentoHemocentroDTO,
    ) {
        await this.garantirHemocentroExistente(hemocentroId);
        if (filtros.status) {
            this.validarStatus(filtros.status);
        }
        this.validarPeriodo(filtros);

        return this.agendamentoRepository.listarPorHemocentro(hemocentroId, filtros);
    }

    async buscarAgendamento(hemocentroId: number, agendamentoId: number) {
        await this.garantirHemocentroExistente(hemocentroId);
        this.validarId(agendamentoId, "agendamento");

        return this.agendamentoRepository.buscarPorIdDoHemocentro(
            hemocentroId,
            agendamentoId,
        );
    }

    async atualizarStatusAgendamento(
        hemocentroId: number,
        agendamentoId: number,
        status: StatusAgendamento,
    ) {
        await this.garantirHemocentroExistente(hemocentroId);
        this.validarId(agendamentoId, "agendamento");
        this.validarStatus(status);

        const agendamento = await this.agendamentoRepository.buscarPorIdDoHemocentro(
            hemocentroId,
            agendamentoId,
        );

        if (!agendamento) {
            return null;
        }

        this.validarTransicaoDeStatus(agendamento.status, status);

        return this.agendamentoRepository.atualizarStatusDoHemocentro(
            hemocentroId,
            agendamentoId,
            agendamento.status,
            status,
            agendamento.doadorId,
            DoadorService.PONTOS_POR_DOACAO,
            agendamento.vagaId,
        );
    }

    private validarId(id: number, entidade = "hemocentro") {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error(`Id do ${entidade} inválido`);
        }
    }

    private async garantirHemocentroExistente(hemocentroId: number) {
        this.validarId(hemocentroId);

        const hemocentro = await this.hemocentroRepository.buscarPorId(hemocentroId);
        if (!hemocentro) {
            throw new Error("Hemocentro não encontrado");
        }
    }

    private validarStatus(status: StatusAgendamento) {
        if (!STATUS_AGENDAMENTO.includes(status)) {
            throw new Error(`Status inválido. Use: ${STATUS_AGENDAMENTO.join(", ")}`);
        }
    }

    private validarTransicaoDeStatus(statusAtual: string, novoStatus: StatusAgendamento) {
        if (statusAtual === novoStatus) {
            return;
        }

        const transicoesPermitidas: Record<string, readonly StatusAgendamento[]> = {
            AGENDADO: ["CONFIRMADO", "CANCELADO"],
            CONFIRMADO: ["REALIZADO", "CANCELADO"],
            REALIZADO: [],
            CANCELADO: [],
        };

        const destinos = transicoesPermitidas[statusAtual] ?? [];
        if (!destinos.includes(novoStatus)) {
            throw new Error(
                `Não é permitido alterar o status de ${statusAtual} para ${novoStatus}`,
            );
        }
    }

    private validarPeriodo(filtros: FiltrosAgendamentoHemocentroDTO) {
        if (
            filtros.dataInicio
            && filtros.dataFim
            && filtros.dataInicio.getTime() > filtros.dataFim.getTime()
        ) {
            throw new Error("A data inicial não pode ser posterior à data final");
        }
    }

    private validarCoordenadas({ latitude, longitude }: CoordenadasDTO) {
        if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
            throw new Error("Latitude inválida");
        }

        if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
            throw new Error("Longitude inválida");
        }
    }

    private calcularDistanciaKm(origem: CoordenadasDTO, destino: CoordenadasDTO) {
        const raioTerraKm = 6371;
        const converterParaRadianos = (graus: number) => graus * Math.PI / 180;
        const diferencaLatitude = converterParaRadianos(destino.latitude - origem.latitude);
        const diferencaLongitude = converterParaRadianos(destino.longitude - origem.longitude);
        const latitudeOrigem = converterParaRadianos(origem.latitude);
        const latitudeDestino = converterParaRadianos(destino.latitude);

        const haversine = Math.sin(diferencaLatitude / 2) ** 2
            + Math.cos(latitudeOrigem)
            * Math.cos(latitudeDestino)
            * Math.sin(diferencaLongitude / 2) ** 2;

        return 2 * raioTerraKm * Math.asin(Math.sqrt(haversine));
    }
}