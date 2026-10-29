import { Router, type Response } from "express";
import { autenticarAdmin } from "../middleware/autenticarAdmin";
import { loginAdmin } from "../service/AdministradorAuthService";
import { AdministradorService } from "../service/AdministradorService";

const routes = Router();
const service = new AdministradorService();
const executar = (res: Response, tarefa: () => Promise<unknown>, sucesso = 200) => {
    void tarefa().then((dados) => res.status(sucesso).json(dados)).catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Erro inesperado";
        const status = message.includes("não encontrado") || message.includes("inexistente") ? 404
            : message.includes("já") || message.includes("simultaneamente") ? 409 : 400;
        res.status(status).json({ message });
    });
};

routes.post("/login", (req, res) => {
    void loginAdmin(req.body?.email, req.body?.senha).then((dados) => res.json(dados)).catch((error: unknown) =>
        res.status(401).json({ message: error instanceof Error ? error.message : "Acesso negado" }));
});
routes.use(autenticarAdmin);
routes.get("/solicitacoes", (_req, res) => executar(res, () => service.listarSolicitacoes()));
routes.patch("/solicitacoes/:id", (req, res) => executar(res, () => service.decidir(Number(req.params.id), req.body?.decisao)));
routes.get("/hemocentros", (_req, res) => executar(res, () => service.listarHemocentros()));
routes.put("/hemocentros/:id", (req, res) => executar(res, () => service.editar(Number(req.params.id), req.body ?? {})));
routes.patch("/hemocentros/:id/status", (req, res) => executar(res, () => service.alterarAtivacao(Number(req.params.id), req.body?.status)));
routes.delete("/hemocentros/:id", (req, res) => executar(res, () => service.alterarAtivacao(Number(req.params.id), "DESATIVADO")));
routes.get("/hemocentros/:id/estoque", (req, res) => executar(res, () => service.listarEstoque(Number(req.params.id))));
routes.post("/hemocentros/:id/estoque/movimentacoes", (req, res) => executar(res, () => service.movimentarEstoque(Number(req.params.id), req.body), 201));
routes.get("/hemocentros/:id/vagas", (req, res) => executar(res, () => service.listarVagas(Number(req.params.id))));
routes.post("/hemocentros/:id/vagas", (req, res) => executar(res, () => service.abrirVaga(Number(req.params.id), req.body), 201));
routes.patch("/hemocentros/:id/vagas/:vagaId", (req, res) => executar(res, () => service.alterarVaga(Number(req.params.id), Number(req.params.vagaId), req.body?.capacidade)));
routes.get("/hemocentros/:id/agendamentos", (req, res) => executar(res, () => service.listarAgendamentos(Number(req.params.id))));
routes.patch("/hemocentros/:id/agendamentos/:agendamentoId/status", (req, res) => executar(res, () => service.alterarAgendamento(Number(req.params.id), Number(req.params.agendamentoId), req.body?.status)));

export { routes as administradorRoutes };
