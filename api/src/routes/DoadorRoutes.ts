import { Router } from "express";
import { DoadorController } from "../controller/DoadorController";
import { exigirDoador } from "../middleware/doadorAuth";

const doadorRoutes = Router();
const doadorController = new DoadorController();

doadorRoutes.post("/cadastro", (req, res) => doadorController.cadastrar(req, res));
doadorRoutes.post("/login", (req, res) => doadorController.entrar(req, res));
doadorRoutes.use(exigirDoador);
doadorRoutes.get("/:id", (req, res) => doadorController.buscarDoador(req, res));
doadorRoutes.put("/:id", (req, res) => doadorController.atualizarDoador(req, res));
doadorRoutes.delete("/:id", (req, res) => doadorController.deletarDoador(req, res));

export { doadorRoutes };
