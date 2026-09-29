export type Sexo = "Masculino" | "Feminino" | "Não identificar";

export type TipoSanguineo = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface DoadorDTO {
    nome: string;
    email: string;
    pontosDoacao: number;
    sexo: Sexo;
    tipoSanguineo: TipoSanguineo;
}

export interface DadosCriacaoDoador extends DoadorDTO {
    DataNascimento: Date;
    password: string;
    cpf: string;
}
