export type Sexo = "Masculino" | "Feminino" | "Não identificar";

export type TipoSanguineo = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface DoadorDTO {
    nome: string;
    email: string;
    pontosDoacao: number;
    sexo: Sexo;
    tipoSanguineo: TipoSanguineo;
}

// A pontuação é controlada pelo backend e começa em zero no banco. Por isso,
// ela não deve ser enviada pelo front durante o cadastro.
export interface DadosCriacaoDoador extends Omit<DoadorDTO, "pontosDoacao"> {
    DataNascimento: Date;
    password: string;
    cpf: string;
}
