import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { ManagementUseCase } from '../../../use-case/management_use_case';
@injectable()
export class ManagementController {
    constructor(
        @inject(ManagementUseCase)
        private managementUseCase: ManagementUseCase
    ) {}

    async handleCreateUser(req: Request, res: Response): Promise<Response> {
        try {
            const userData = req.body;
            const user = await this.managementUseCase.createUser(userData);
            return res.status(201).json(user);
        } catch (err: any) {
            return res.status(400).json({
                message: err.message || 'Erro ao criar usuário'
            });
        }
    }
}