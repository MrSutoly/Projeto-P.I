import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { RegisterUseCase } from '../../use-case/register_use_case';

@injectable()
export class RegisterController{
    constructor(
        @inject(RegisterUseCase)
        private registerUseCase: RegisterUseCase) 
        {}

    async handle(req: Request, res: Response): Promise<Response> {
        try{
            const { nome, email, password, role } = req.body;

            if (!nome || !email || !password || !role) {
                return res.status(400).json({ 
                    message: 'Todos os campos são obrigatórios' 
                });
            }

            const result = await this.registerUseCase.execute({ nome, email, password, role });

            return res.status(201).json(result);
        }catch(err: any){
            return res.status(400).json({
                message: err.message || 'Erro inesperado no registro',
            });
        }
    }
}