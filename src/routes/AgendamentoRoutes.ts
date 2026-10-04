import { Router } from "express";
import { AgendamentoController } from "../controller/AgendamentoController";

const agendamentoRoutes = Router();
const agendamentoController = new AgendamentoController();

agendamentoRoutes.post("/", (req, res) => agendamentoController.agendar(req, res));
agendamentoRoutes.get("/doador/:doadorId", (req, res) => agendamentoController.listarPorDoador(req, res));

export { agendamentoRoutes };
