import { IRegisterRepository } from '../repository/i_register_repository';
import { UserRegi } from '../entitie/user_type';
import { inject, injectable } from "tsyringe";

@injectable()
export class RegisterUseCase{
    constructor(
        @inject('RegisterRepository')
        private registerRepository: IRegisterRepository) 
        {}

    async execute(userData: Omit<UserRegi, 'id'>): Promise<UserRegi> {

        const userExists = await this.registerRepository.findByEmail(userData.email);
    
        if (userExists) {
            throw new Error('Usuário já existe');
        }

        if(!userData.nome || !userData.email || !userData.password || !userData.role){
            throw new Error('Preencha todos os campos');
        }

        const user = await this.registerRepository.createUser(userData);

        return{
            id: user.id,
            nome: user.nome,
            email: user.email,
            password: user.password,
            role: user.role
        }as UserRegi;
    }
}