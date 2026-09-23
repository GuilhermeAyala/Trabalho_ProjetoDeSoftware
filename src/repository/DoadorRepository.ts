import { PrismaClient } from "@prisma/client";
import type { DoadorDTO } from "../dto/DoadorDTO";

const prisma = new PrismaClient();

//tem de fazer a conexão com o banco futuramente

export class DoadorRepository{

    async adicionarDoador(novoDoador: DoadorDTO){
        return prisma.doador.create({
            data: novoDoador
        })
    }

    async atualizarDoador(id: number, newData: DoadorDTO){
        return prisma.doador.update({
            where: {id},
            data: newData
        })
    }

    async deletarDoador(id: number){
        return prisma.doador.delete({
            where: {id}
        })
    }

    async findDoador(id: number){
        return prisma.doador.findUnique({
            where: {id}
        })
    }

    async findAll(){
        return prisma.doador.findMany();
    }
}
