import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { ManagementUseCase } from '../../../use-case/management_use_case';

@injectable()
export class ManagementController {
    constructor(
        @inject(ManagementUseCase)
        private managementUseCase: ManagementUseCase
    ) {}

    async handleUpdateUser(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const userData = { ...req.body, id: Number(id) };
            const user = await this.managementUseCase.updateUser(userData);
            return res.json(user);
        } catch (err: any) {
            return res.status(400).json({
                message: err.message || 'Erro ao atualizar usuário'
            });
        }
    }
}