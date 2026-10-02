import { DoadorRepository } from "../repository/DoadorRepository";
import type { DadosCriacaoDoador, DoadorDTO, Sexo, TipoSanguineo } from "../dto/DoadorDTO";

export type { DoadorDTO } from "../dto/DoadorDTO";

export class DoadorService {
    static readonly PONTOS_POR_DOACAO = 50; //constante para ganho de pontos ao realizar a doação
    public doadorRepository: DoadorRepository;

    constructor(){
        this.doadorRepository = new DoadorRepository();
    }

    validarDoador(dados: DoadorDTO): boolean {
        const sexosPermitidos: Sexo[] = ["Masculino", "Feminino", "Não identificar"];
        const tiposSanguineosPermitidos: TipoSanguineo[] = [
            "A+",
            "A-",
            "B+",
            "B-",
            "AB+",
            "AB-",
            "O+",
            "O-",
        ];

        if(!dados.nome || !dados.email || !dados.sexo || !dados.tipoSanguineo){
            throw new Error("OS dados devem existir para a criação do doados")
        }
        if(!dados.email.includes("@")){
            throw new Error("Email inválido, deve estar presente o @")
        }
        if(!sexosPermitidos.includes(dados.sexo)){
            throw new Error("é necessário que haja apenas sexo masculino, feminino ou quem não se identifica")
        }
        if(!tiposSanguineosPermitidos.includes(dados.tipoSanguineo)){
            throw new Error("Tipo de Sangue precisa ser igual aos já definidos")
        }

        return true;
    }

    async criarDoador(dados: DadosCriacaoDoador){
        if(this.validarDoador(dados)){
            return this.doadorRepository.adicionarDoador(dados);
        }
    }

    async atualizarDoador(id: number, dados: DoadorDTO){
        if(this.validarDoador(dados)){
            return this.doadorRepository.atualizarDoador(id, dados);
        }
    }

    async deletarDoador(id: number){
        return this.doadorRepository.deletarDoador(id);
    }

    async buscarDoador(id: number){
        return this.doadorRepository.findDoador(id);
    }

    async listarDoadores(){
        return this.doadorRepository.findAll();
    }

    // Regra de negócio: uma doação confirmada vale 50 pontos.
    ganharPontos(pontosAtuais: number, doacaoConfirmada: boolean): number {
        if (!Number.isInteger(pontosAtuais) || pontosAtuais < 0) {
            throw new Error("A pontuação atual deve ser um número inteiro não negativo");
        }

        return doacaoConfirmada
            ? pontosAtuais + DoadorService.PONTOS_POR_DOACAO
            : pontosAtuais;
    }

    async confirmarDoacao(id: number){
        return this.doadorRepository.adicionarPontosPorDoacaoConfirmada(
            id,
            DoadorService.PONTOS_POR_DOACAO,
        );
    }

    async agendarDoacao(){
        
    }

    async realizarTriagem(){

    }
}

//agendar doação, triagem no app; consultar hemocentro
//não sei se seria pelo service do doador, pensar sobre
