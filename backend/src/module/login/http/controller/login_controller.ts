import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { LoginUseCase } from '../../use-case/login_use_case';

@injectable()
export class LoginController {
    constructor(
        @inject(LoginUseCase)
        private loginUseCase: LoginUseCase
    ) {}

    async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;

            const result = await this.loginUseCase.execute({ email, password });

            return res.json(result);
        } catch (err: any) {
            return res.status(400).json({
                message: err.message || 'Erro inesperado no login',
            });
        }
    }
}