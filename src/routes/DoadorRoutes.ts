import { Router } from "express";
import { DoadorController } from "../controller/DoadorController";

const doadorRoutes = Router();
const doadorController = new DoadorController();

doadorRoutes.post("/", (req, res) => doadorController.criarDoador(req, res));
doadorRoutes.get("/", (req, res) => doadorController.listarDoadores(req, res));
doadorRoutes.get("/:id", (req, res) => doadorController.buscarDoador(req, res));
doadorRoutes.put("/:id", (req, res) => doadorController.atualizarDoador(req, res));
doadorRoutes.delete("/:id", (req, res) => doadorController.deletarDoador(req, res));
doadorRoutes.post("/:id/doacoes/confirmar", (req, res) => doadorController.confirmarDoacao(req, res));

export { doadorRoutes };
