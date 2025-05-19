import { injectable, inject } from 'tsyringe';
import { ILoginRepository } from "../repository/i_login_repository";

@injectable()
export class LoginUseCase {
    constructor(
        @inject('LoginRepository')
        private loginRepository: ILoginRepository
    ) {}

    async execute({ email, password }: { email: string; password: string }) {
        const user = await this.loginRepository.findbyEmail(email);

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const validPassword = await this.loginRepository.validPassword(password, user.password);

        if (!validPassword) {
            throw new Error('Senha inválida');
        }

        return {
            id: user.id!,
            nome: user.nome,
            email: user.email,
            role: user.role,
        };
    }
}