import express from "express";
import dotenv from "dotenv";
import { doadorRoutes } from "./routes/DoadorRoutes";
import { agendamentoRoutes } from "./routes/AgendamentoRoutes";
import { hemocentroRoutes } from "./routes/HemocentroRoutes";
import { triagemRoutes } from "./routes/TriagemRoutes";
import { administradorRoutes } from "./routes/AdministradorRoutes";
import { migrarCpfsLegados } from "./service/CpfMigrationService";
import { conectarRedis, encerrarRedis, verificarRedis } from "./cache/RedisCache";

dotenv.config();

const app = express();
const port = 3000;

// Permite que o Expo Web acesse a API durante o desenvolvimento. Como não há
// cookies ou credenciais neste protótipo, a origem pode ser aberta localmente.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");

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
app.use("/admin", administradorRoutes);
app.use("/triagens", triagemRoutes);

app.get("/", (_req, res) => {
  res.send("API rodando");
});

app.get("/health", async (_req, res) => {
  res.json({
    api: "ok",
    postgres: "fonte-de-verdade",
    redis: await verificarRedis() ? "ok" : "indisponivel",
  });
});

async function iniciarServidor() {
  // A conexão acontece em segundo plano: a indisponibilidade do cache não
  // impede a API de iniciar e consultar a fonte de verdade no PostgreSQL.
  void conectarRedis();
  const cpfsMigrados = await migrarCpfsLegados();
  if (cpfsMigrados > 0) {
    console.log(`${cpfsMigrados} CPF(s) legado(s) foram criptografados.`);
  }

  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}

for (const sinal of ["SIGINT", "SIGTERM"] as const) {
  process.once(sinal, () => {
    void encerrarRedis().finally(() => process.exit(0));
  });
}

void iniciarServidor().catch((error: unknown) => {
  console.error("Não foi possível iniciar a API.", error);
  process.exitCode = 1;
});
