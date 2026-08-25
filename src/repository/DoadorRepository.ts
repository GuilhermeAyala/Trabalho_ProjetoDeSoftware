import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//tem de fazer a conexão com o banco futuramente

export class DoadorRepository{

    async adicionarDoador(novoDoador: any){
        return prisma.doador.create({
        data: novoDoador
        })
    }

    async atualizarDoador(id: number, newData: any){
        return prisma.doador.update({
        where: {id},
        data: newData
        })
    }

    async deletarDoador(id: number){
    return prisma.doador.delete({
        where:{id}
    })
    }
}

