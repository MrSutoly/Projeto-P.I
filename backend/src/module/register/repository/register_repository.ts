import { UserRegi } from "../entitie/user_type";
import { IRegisterRepository } from "./i_register_repository";
import bcrypt from 'bcrypt';
import { executeQuery } from "../../../shared/database/mysql/db";
import { injectable } from "tsyringe";

@injectable()
export class RegisterRepository implements IRegisterRepository {
    async findByEmail(email: string): Promise<UserRegi | null> {
        const [user] = await executeQuery<UserRegi[]>(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );
        return user || null;
    }

    async createUser(user: UserRegi): Promise<UserRegi> {
        const hashedPass = await bcrypt.hash(user.password, 10);

        const result = await executeQuery<UserRegi[]>(
            'INSERT INTO usuarios (nome, email, password, role) VALUES (?, ?, ?, ?)',
            [user.nome, user.email, hashedPass, user.role]
        );

        return{
            id: user.id!,
            nome: user.nome,
            email: user.email,
            password: hashedPass,
            role: user.role
        }
    }
        
}
