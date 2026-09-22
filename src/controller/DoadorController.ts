import {Request, Response} from "express";
import { DoadorService, DoadorDTO } from "../service/DoadorService";

export class DoadorController {
    //cuida de status de criação, 204, 404, etc 
    //vai retornar requisição e resposta
    public DoadorService: DoadorService
    public DoadorDTO: DoadorDTO

    constructor(){
        this.DoadorService = new DoadorService
        this.DoadorDTO = new DoadorDTO
    }

    async criarDoador(req: Request, res: Response){
        try {
            const dadosDoador: DoadorDTO = req.body;
            const response = await this.DoadorService.validarDoador(this.DoadorDTO)
            return res.status(201).json({message: `Doador criado com sucesso`})
        } catch (error) {
            return res.status(400).json({message: error})
        }

    }//lógica parece incorreta, verificar se o DTO de fato está funcionando aqui
}