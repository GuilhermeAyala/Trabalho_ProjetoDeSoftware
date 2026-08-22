import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("API rodando");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});