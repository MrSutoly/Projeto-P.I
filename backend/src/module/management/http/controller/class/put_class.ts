import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { ManagementUseCase } from '../../../use-case/management_use_case';
@injectable()
export class ManagementController {
    constructor(
        @inject(ManagementUseCase)
        private managementUseCase: ManagementUseCase
    ) {}

    async handleUpdateClass(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { nome, codigo } = req.body;
            if (!nome || !codigo) {
                return res.status(400).json({
                    message: 'Nome e código da turma são obrigatórios'
                });
            }

            const classData = {
                id: Number(id),
                nome,
                codigo
            }
            const updatedClass = await this.managementUseCase.updateClass(classData);
            return res.json(updatedClass);
        } catch (err: any) {
            return res.status(400).json({
                message: err.message || 'Erro ao atualizar turma'
            });
        }
    }
}