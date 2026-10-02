import { Router } from "express";
import { HemocentroController } from "../controller/HemocentroController";

const hemocentroRoutes = Router();
const hemocentroController = new HemocentroController();

hemocentroRoutes.get("/", (req, res) => hemocentroController.listar(req, res));
hemocentroRoutes.get("/:id", (req, res) => hemocentroController.buscarPorId(req, res));

export { hemocentroRoutes };
