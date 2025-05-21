import { injectable, inject } from 'tsyringe';
import { ILoginRepository } from "../repository/i_login_repository";
import { JWTService } from '../../auth/services/jwt_service';

@injectable()
export class LoginUseCase {
    constructor(
        @inject('LoginRepository')
        private loginRepository: ILoginRepository,
        private jwtService: JWTService
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

        const token = this.jwtService.generateToken({
            id: user.id!,
            nome: user.nome,
            email: user.email,
            role: user.role,
        });

        return {
            user: { 
            id: user.id!,
            nome: user.nome,
            email: user.email,
            role: user.role,
            },
            token
        };
    }
}