import { IRegisterRepository } from '../repository/i_register_repository';
import { User } from '../../../shared/util/entities/user_type';
import { inject, injectable } from "tsyringe";

@injectable()
export class RegisterUseCase{
    constructor(
        @inject('RegisterRepository')
        private registerRepository: IRegisterRepository) 
        {}

    async execute(userData: Omit<User, 'id'>): Promise<User> {

        const userExists = await this.registerRepository.findByEmail(userData.email);
        
        const validRoles = ['admin', 'professor', 'aluno'];

        if (userExists) {
            throw new Error('Email já cadastrado');
        }

        if(!userData.nome || !userData.email || !userData.password || !userData.role){
            throw new Error('Preencha todos os campos');
        }

        if(!validRoles.includes(userData.role)){
            throw new Error('Tipo de usuário inválido');
        }

        const user = await this.registerRepository.createUser(userData);

        return{
            id: user.id,
            nome: user.nome,
            email: user.email,
            password: user.password,
            role: user.role
        }as User;
    }
}