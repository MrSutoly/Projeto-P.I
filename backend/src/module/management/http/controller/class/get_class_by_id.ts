import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { ManagementUseCase } from '../../../use-case/management_use_case';
@injectable()
export class ManagementController {
    constructor(
        @inject(ManagementUseCase)
        private managementUseCase: ManagementUseCase
    ) {}
    
    async handleGetClass(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const classData = await this.managementUseCase.findClassById(Number(id));
            
            if (!classData) {
                return res.status(404).json({ message: 'Turma não encontrada' });
            }

            return res.json(classData);
        } catch (err: any) {
            return res.status(400).json({
                message: err.message || 'Erro ao buscar turma'
            });
        }
    }
}