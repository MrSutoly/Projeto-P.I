import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { ManagementUseCase } from '../../../use-case/management_use_case';
@injectable()
export class ManagementController {
    constructor(
        @inject(ManagementUseCase)
        private managementUseCase: ManagementUseCase
    ) {}

    async handleGetUsersByClass(req: Request, res: Response): Promise<Response> {
        try {
            const { classId } = req.params;
            const users = await this.managementUseCase.findUsersByClass(Number(classId));
            return res.json(users);
        } catch (err: any) {
            return res.status(400).json({
                message: err.message || 'Erro ao buscar usuários da turma'
            });
        }
    }
}