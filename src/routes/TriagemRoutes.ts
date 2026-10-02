import { Router } from "express";
import { TriagemController } from "../controller/TriagemController";

const triagemRoutes = Router();
const triagemController = new TriagemController();

triagemRoutes.post("/", (req, res) => triagemController.realizar(req, res));
triagemRoutes.get("/doador/:doadorId/ultima", (req, res) => triagemController.buscarUltima(req, res));

export { triagemRoutes };
