import { DoadorRepository } from "../repository/DoadorRepository";

interface DoadorDTO {
    nome: String;
    email: String;
    sexo: String;
    tipoSanguineo: String;
    //verificar se há necessidade de fazer dessa forma, devido ao prisma já estar com tipagem
    //Independe de qualquer coisa, DTO é necessário para proteção das informações
    //Verificar quais são sensiveis e não sensiveis para colocar ou não no DTO
}

export class DoadorService {
    validarDoador(dados: DoadorDTO): boolean {
        if(!dados.nome || !dados.email || !dados.sexo || !dados.tipoSanguineo){
            throw new Error("OS dados devem existir para a criação do doados")
        }

        return true; 
        //continuar as validação 
    }
}