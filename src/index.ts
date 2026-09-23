import express from "express";
import dotenv from "dotenv";
import { doadorRoutes } from "./routes/DoadorRoutes";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use("/doador", doadorRoutes);

app.get("/", (_req, res) => {
  res.send("API rodando");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
