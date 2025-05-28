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
            const {nome, codigo} = req.body;

            if(!nome || !codigo) {
                return res.status(400).json({
                    message: 'Nome e código da turma são obrigatórios'
                })
            }
            
            const classData = {
                nome,
                codigo
            }

            const newClass = await this.managementUseCase.createClass(classData);
            return res.status(201).json(newClass);
        } catch (err: any) {
            return res.status(400).json({
                message: err.message || 'Erro ao criar turma'
            });
        }
    }
}