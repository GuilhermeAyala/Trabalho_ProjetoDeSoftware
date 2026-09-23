import { DoadorRepository } from "../repository/DoadorRepository";
import type { DoadorDTO, Sexo, TipoSanguineo } from "../dto/DoadorDTO";

export type { DoadorDTO } from "../dto/DoadorDTO";

export class DoadorService {
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

    async criarDoador(dados: DoadorDTO){
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
}
