import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { ManagementUseCase } from '../../../use-case/management_use_case';
@injectable()
export class ManagementController {
    constructor(
        @inject(ManagementUseCase)
        private managementUseCase: ManagementUseCase
    ) {}

    async handleCreateClass(req: Request, res: Response): Promise<Response> {
        try {
            const classData = req.body;
            const newClass = await this.managementUseCase.createClass(classData);
            return res.status(201).json(newClass);
        } catch (err: any) {
            return res.status(400).json({
                message: err.message || 'Erro ao criar turma'
            });
        }
    }
}