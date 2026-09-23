import { Router } from "express";
import { DoadorController } from "../controller/DoadorController";

const doadorRoutes = Router();
const doadorController = new DoadorController();

doadorRoutes.post("/doadores", (req, res) => doadorController.criarDoador(req, res));
doadorRoutes.get("/doadores", (req, res) => doadorController.listarDoadores(req, res));
doadorRoutes.get("/doadores/:id", (req, res) => doadorController.buscarDoador(req, res));
doadorRoutes.put("/doadores/:id", (req, res) => doadorController.atualizarDoador(req, res));
doadorRoutes.delete("/doadores/:id", (req, res) => doadorController.deletarDoador(req, res));

export { doadorRoutes };
