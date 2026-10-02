import type {
    RealizarTriagemDTO,
    RespostasTriagemDTO,
    ResultadoTriagemDTO,
} from "../dto/TriagemDTO";
import { TriagemRepository } from "../repository/TriagemRepository";
import { DoadorService } from "./DoadorService";

export class TriagemService {
    constructor(
        private readonly triagemRepository = new TriagemRepository(),
        private readonly doadorService = new DoadorService(),
    ) {}

    async realizarTriagem(dados: RealizarTriagemDTO): Promise<ResultadoTriagemDTO> {
        if (!dados || typeof dados !== "object") {
            throw new Error("Os dados da triagem são obrigatórios");
        }

        this.validarId(dados.doadorId);
        this.validarRespostas(dados.respostas);

        const doador = await this.doadorService.buscarDoador(dados.doadorId);
        if (!doador) {
            throw new Error("Doador não encontrado");
        }

        const motivosInaptidao = this.obterMotivosInaptidao(dados.respostas);

        // Este resultado é uma pré-triagem informativa. A decisão clínica final
        // continua sendo responsabilidade do profissional no hemocentro.
        return this.triagemRepository.salvar(
            dados.doadorId,
            dados.respostas,
            motivosInaptidao.length === 0,
            motivosInaptidao,
        );
    }

    async buscarUltimaTriagem(doadorId: number) {
        this.validarId(doadorId);
        return this.triagemRepository.buscarUltimaPorDoador(doadorId);
    }

    private validarId(id: number) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("Id do doador inválido");
        }
    }

    private validarRespostas(respostas: RespostasTriagemDTO) {
        if (!respostas || typeof respostas !== "object") {
            throw new Error("As respostas da triagem são obrigatórias");
        }

        const nomesDasRespostas: (keyof RespostasTriagemDTO)[] = [
            "estaEmBoasCondicoesDeSaude",
            "pesaNoMinimo50Kg",
            "dormiuPeloMenosSeisHoras",
            "estaAlimentado",
            "consumiuAlcoolNasUltimas12Horas",
            "possuiSintomasInfecciosos",
            "fezProcedimentoDeRiscoRecente",
        ];

        const possuiRespostaInvalida = nomesDasRespostas.some(
            (nome) => typeof respostas[nome] !== "boolean",
        );

        if (possuiRespostaInvalida) {
            throw new Error("Todas as perguntas da triagem devem ser respondidas com true ou false");
        }
    }

    private obterMotivosInaptidao(respostas: RespostasTriagemDTO): string[] {
        const motivos: string[] = [];

        if (!respostas.estaEmBoasCondicoesDeSaude) motivos.push("Condição de saúde informada");
        if (!respostas.pesaNoMinimo50Kg) motivos.push("Peso inferior a 50 kg");
        if (!respostas.dormiuPeloMenosSeisHoras) motivos.push("Descanso insuficiente");
        if (!respostas.estaAlimentado) motivos.push("Alimentação insuficiente");
        if (respostas.consumiuAlcoolNasUltimas12Horas) motivos.push("Consumo recente de álcool");
        if (respostas.possuiSintomasInfecciosos) motivos.push("Sintomas infecciosos informados");
        if (respostas.fezProcedimentoDeRiscoRecente) motivos.push("Procedimento recente informado");

        return motivos;
    }
}
