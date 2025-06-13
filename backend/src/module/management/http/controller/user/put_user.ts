import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { ManagementUseCase } from '../../../use-case/management_use_case';
import { User } from '../../../../../shared/util/entities/user_type';

@injectable()
export class UpdateUserController {
    constructor(
        @inject(ManagementUseCase)
        private managementUseCase: ManagementUseCase
    ) {}

    async handle(req: Request, res: Response): Promise<Response> {
        try {
            const userId = Number(req.params.id);
            const { nome, email, password, role, class_id } = req.body;

            if (!userId || !nome || !email || !password || !role || !class_id) {
                return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
            }

            const updatedUser: User = await this.managementUseCase.updateUser({
                id: userId,
                nome,
                email,
                password,
                role,
                class_id: Number(class_id),
            });

            return res.status(200).json(updatedUser);
        } catch (error: any) {
            return res.status(400).json({ message: error.message || 'Erro ao atualizar usuário' });
        }
    }
}