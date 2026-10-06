import express from "express";
import dotenv from "dotenv";
import { doadorRoutes } from "./routes/DoadorRoutes";
import { agendamentoRoutes } from "./routes/AgendamentoRoutes";
import { hemocentroRoutes } from "./routes/HemocentroRoutes";
import { triagemRoutes } from "./routes/TriagemRoutes";

dotenv.config();

const app = express();
const port = 3000;

// Permite que o Expo Web acesse a API durante o desenvolvimento. Como não há
// cookies ou credenciais neste protótipo, a origem pode ser aberta localmente.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

  // O navegador envia OPTIONS antes de POSTs JSON. Encerrar a preflight aqui
  // evita que o cliente HTTP bloqueie a triagem antes de chegar ao controller.
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});
app.use(express.json());
// Endpoint principal do perfil. A segunda montagem preserva a URL antiga para
// não quebrar consumidores que ainda utilizem /doador/doadores.
app.use("/doadores", doadorRoutes);
app.use("/doador/doadores", doadorRoutes);
app.use("/agendamentos", agendamentoRoutes);
app.use("/hemocentros", hemocentroRoutes);
app.use("/triagens", triagemRoutes);

app.get("/", (_req, res) => {
  res.send("API rodando");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
