import { TIPOS_SANGUINEOS, type MovimentarEstoqueDTO } from "../dto/EstoqueDTO";
import { EstoqueRepository } from "../repository/EstoqueRepository";

export class EstoqueService {
    constructor(private readonly repository = new EstoqueRepository()) {}

    listar(hemocentroId: number) { return this.repository.listar(hemocentroId); }
    historico(hemocentroId: number) { return this.repository.listarMovimentacoes(hemocentroId); }

    movimentar(hemocentroId: number, dados: MovimentarEstoqueDTO) {
        if (!dados || !TIPOS_SANGUINEOS.includes(dados.tipoSanguineo)) throw new Error("Tipo sanguíneo inválido");
        if (dados.tipo !== "ENTRADA" && dados.tipo !== "BAIXA") throw new Error("Movimentação inválida");
        if (!Number.isInteger(dados.quantidade) || dados.quantidade <= 0) throw new Error("Informe uma quantidade inteira maior que zero");
        if (typeof dados.motivo !== "string" || dados.motivo.trim().length < 3 || dados.motivo.trim().length > 200) {
            throw new Error("Informe um motivo entre 3 e 200 caracteres");
        }
        return this.repository.movimentar(hemocentroId, { ...dados, motivo: dados.motivo.trim() });
    }
}
