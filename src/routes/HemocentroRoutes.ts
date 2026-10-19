import { Router } from "express";
import { HemocentroController } from "../controller/HemocentroController";
import { HemocentroPortalController } from "../controller/HemocentroPortalController";
import { autenticarHemocentro, conferirHemocentroDaRota } from "../middleware/autenticarHemocentro";
import { VagaController } from "../controller/VagaController";

const hemocentroRoutes = Router();
const hemocentroController = new HemocentroController();
const portalController = new HemocentroPortalController();
const vagaController = new VagaController();

hemocentroRoutes.get("/", (req, res) => hemocentroController.listar(req, res));
hemocentroRoutes.post("/cadastro", (req, res) => portalController.cadastrar(req, res));
hemocentroRoutes.post("/login", (req, res) => portalController.entrar(req, res));
hemocentroRoutes.get("/me", autenticarHemocentro, (req, res) => portalController.perfil(req, res));
hemocentroRoutes.get("/me/estoque", autenticarHemocentro, (req, res) => portalController.listarEstoque(req, res));
hemocentroRoutes.get("/me/estoque/movimentacoes", autenticarHemocentro, (req, res) => portalController.historicoEstoque(req, res));
hemocentroRoutes.post("/me/estoque/movimentacoes", autenticarHemocentro, (req, res) => portalController.movimentarEstoque(req, res));
hemocentroRoutes.get("/me/vagas", autenticarHemocentro, (req, res) => vagaController.listar(req, res));
hemocentroRoutes.post("/me/vagas", autenticarHemocentro, (req, res) => vagaController.abrir(req, res));
hemocentroRoutes.patch("/me/vagas/:vagaId", autenticarHemocentro, (req, res) => vagaController.alterar(req, res));
hemocentroRoutes.get("/me/agendamentos", autenticarHemocentro, (req, res) =>
    hemocentroController.listarAgendamentos(req, res),
);
hemocentroRoutes.get("/me/agendamentos/:agendamentoId", autenticarHemocentro, (req, res) =>
    hemocentroController.buscarAgendamento(req, res),
);
hemocentroRoutes.patch("/me/agendamentos/:agendamentoId/status", autenticarHemocentro, (req, res) =>
    hemocentroController.atualizarStatusAgendamento(req, res),
);
hemocentroRoutes.get("/:hemocentroId/agendamentos", autenticarHemocentro, conferirHemocentroDaRota, (req, res) =>
    hemocentroController.listarAgendamentos(req, res),
);
hemocentroRoutes.get("/:hemocentroId/agendamentos/:agendamentoId", autenticarHemocentro, conferirHemocentroDaRota, (req, res) =>
    hemocentroController.buscarAgendamento(req, res),
);
hemocentroRoutes.patch("/:hemocentroId/agendamentos/:agendamentoId/status", autenticarHemocentro, conferirHemocentroDaRota, (req, res) =>
    hemocentroController.atualizarStatusAgendamento(req, res),
);
hemocentroRoutes.get("/:id/vagas", (req, res) => vagaController.listarPublico(req, res));
hemocentroRoutes.get("/:id", (req, res) => hemocentroController.buscarPorId(req, res));

export { hemocentroRoutes };
