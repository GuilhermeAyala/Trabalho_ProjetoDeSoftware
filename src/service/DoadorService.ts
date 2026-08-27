import { DoadorRepository } from "../repository/DoadorRepository";

type Sexo = "Masculino" | "Feminino" | "Não identificar";
type TipoSanguineo  = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

interface DoadorDTO {
    nome: String;
    email: String;
    sexo: Sexo;
    tipoSanguineo: TipoSanguineo;
    //verificar se há necessidade de fazer dessa forma, devido ao prisma já estar com tipagem
    //Independe de qualquer coisa, DTO é necessário para proteção das informações
    //Verificar quais são sensiveis e não sensiveis para colocar ou não no DTO
}

export class DoadorService {
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
        //continuar as validação 
    }

    criarDoador(dados: DoadorDTO){
        if(this.validarDoador(dados)){
            //criar o doador
        }
    }
}