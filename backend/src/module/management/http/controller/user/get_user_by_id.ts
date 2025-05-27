import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { ManagementUseCase } from '../../../use-case/management_use_case';


@injectable()
export class ManagementController {
    constructor(
        @inject(ManagementUseCase)
        private managementUseCase: ManagementUseCase
    ) {}
    
    async handleGetUser(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const user = await this.managementUseCase.findUserById(Number(id));
            
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            return res.json(user);
        } catch (err: any) {
            return res.status(400).json({
                message: err.message || 'Erro ao buscar usuário'
            });
        }
    }
}