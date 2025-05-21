/*
import { IUserRepository } from "../../domains/repositorys/i_user_repository";

    export class UserToClassUseCase {
        constructor(private userRepository: IUserRepository) {}

        async execute(userId: number, classId: number): Promise<void> {
            
            if(!userId || !classId) {
                throw new Error("ID do usuário e ID da turma são obrigatórios.");
            }

            return await this.userRepository.UserToClass(userId, classId);
    }
}
    */