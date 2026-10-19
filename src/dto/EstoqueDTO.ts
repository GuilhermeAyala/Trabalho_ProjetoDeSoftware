export const TIPOS_SANGUINEOS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export type TipoSanguineo = typeof TIPOS_SANGUINEOS[number];
export type TipoMovimentacao = "ENTRADA" | "BAIXA";

export interface MovimentarEstoqueDTO {
    tipoSanguineo: TipoSanguineo;
    tipo: TipoMovimentacao;
    quantidade: number;
    motivo: string;
}

export function nivelDoEstoque(quantidade: number) {
    if (quantidade === 0) return "ESGOTADO";
    if (quantidade <= 5) return "CRITICO";
    if (quantidade <= 15) return "BAIXO";
    return "ADEQUADO";
}
