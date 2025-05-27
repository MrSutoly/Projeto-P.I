import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { ManagementUseCase } from '../../../use-case/management_use_case';

@injectable()
export class ManagementController {
    constructor(
        @inject(ManagementUseCase)
        private managementUseCase: ManagementUseCase
    ) {}

    async handleDeleteUser(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            await this.managementUseCase.deleteUser(Number(id));
            return res.status(204).send();
        } catch (err: any) {
            return res.status(400).json({
                message: err.message || 'Erro ao deletar usuário'
            });
        }
    }
}