import { Router } from "express";
import { TriagemController } from "../controller/TriagemController";
import { exigirDoador } from "../middleware/doadorAuth";

const triagemRoutes = Router();
const triagemController = new TriagemController();

triagemRoutes.post("/", exigirDoador, (req, res) => triagemController.realizar(req, res));
triagemRoutes.get("/doador/:doadorId/ultima", (req, res) => triagemController.buscarUltima(req, res));

export { triagemRoutes };
