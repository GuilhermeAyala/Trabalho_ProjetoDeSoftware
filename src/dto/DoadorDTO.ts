export type Sexo = "Masculino" | "Feminino" | "Não identificar";

export type TipoSanguineo = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface DoadorDTO {
    nome: string;
    email: string;
    sexo: Sexo;
    tipoSanguineo: TipoSanguineo;
}
