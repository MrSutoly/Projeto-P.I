import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { ManagementUseCase } from '../../../use-case/management_use_case';

@injectable()
export class AddStudentController {
    constructor(
        @inject(ManagementUseCase)
        private managementUseCase: ManagementUseCase
    ) {}

    async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { classId } = req.params;
            const { studentId } = req.body;

            await this.managementUseCase.addStudentToClass(
                Number(studentId),
                Number(classId)
            );

            return res.status(200).json({ message: 'Aluno adicionado com sucesso' });
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || 'Erro ao adicionar aluno à turma'
            });
        }
    }
}