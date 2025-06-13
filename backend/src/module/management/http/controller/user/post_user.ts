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
            const { nome, email, password, role, turma_id }= req.body;

            if (!nome || !email || !password || !role || !turma_id) {
                return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
            }

            const user = await this.managementUseCase.createUser({
                nome,
                email,
                password,
                role,
                class_id: Number(turma_id)
            });
            return res.status(201).json(user);
        } catch (err: any) {
            return res.status(400).json({
                message: err.message || 'Erro ao criar usuário'
            });
        }
    }
}