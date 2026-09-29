import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import type { DadosCriacaoDoador, DoadorDTO } from "../dto/DoadorDTO";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL não está configurada.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export class DoadorRepository{
    /**
     * O select é definido no repository para impedir que CPF e senha saiam
     * do banco por acidente em qualquer endpoint de consulta.
     */
    private readonly camposPublicos = {
        id: true,
        nome: true,
        email: true,
        sexo: true,
        tipoSanguineo: true,
        pontosDoacao: true,
    } as const;

    // Usado somente pelo fluxo de cadastro. Os campos sensíveis entram aqui,
    // mas o select abaixo impede que eles sejam devolvidos ao controller/front.
    async adicionarDoador(novoDoador: DadosCriacaoDoador){
        return prisma.doador.create({
            data: {
                nome: novoDoador.nome,
                email: novoDoador.email,
                DataNascimento: novoDoador.DataNascimento,
                password: novoDoador.password,
                cpf: novoDoador.cpf,
                sexo: novoDoador.sexo,
                tipoSanguineo: novoDoador.tipoSanguineo,
            },
            select: this.camposPublicos,
        });
    }

    async atualizarDoador(id: number, newData: DoadorDTO){
        return prisma.doador.update({
            where: { id },
            data: {
                nome: newData.nome,
                email: newData.email,
                sexo: newData.sexo,
                tipoSanguineo: newData.tipoSanguineo,
            },
            select: this.camposPublicos,
        });
    }

    // Cada confirmação adiciona 50 pontos sem sobrescrever o valor atual.
    async adicionarPontosPorDoacaoConfirmada(id: number, pontos: number){
        return prisma.doador.update({
            where: { id },
            data: {
                pontosDoacao: {
                    increment: pontos,
                },
            },
            select: this.camposPublicos,
        });
    }

    async deletarDoador(id: number){
        return prisma.doador.delete({
            where: { id },
        });
    }

    async findDoador(id: number){
        return prisma.doador.findUnique({
            where: { id },
            select: this.camposPublicos,
        });
    }

    async findAll(){
        return prisma.doador.findMany({
            select: this.camposPublicos,
        });
    }
}
