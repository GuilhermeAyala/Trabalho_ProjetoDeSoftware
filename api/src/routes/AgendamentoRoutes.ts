import { Router } from "express";
import { AgendamentoController } from "../controller/AgendamentoController";
import { exigirDoador } from "../middleware/doadorAuth";

const agendamentoRoutes = Router();
const agendamentoController = new AgendamentoController();

agendamentoRoutes.post("/", exigirDoador, (req, res) => agendamentoController.agendar(req, res));
agendamentoRoutes.get("/doador/:doadorId", exigirDoador, (req, res) => agendamentoController.listarPorDoador(req, res));

export { agendamentoRoutes };
