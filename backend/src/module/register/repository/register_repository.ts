import { User } from '../../../shared/util/entities/user_type';
import { IRegisterRepository } from "./i_register_repository";
import bcrypt from 'bcrypt';
import { executeQuery } from "../../../shared/database/mysql/db";
import { injectable } from "tsyringe";

@injectable()
export class RegisterRepository implements IRegisterRepository {
    async findByEmail(email: string): Promise<User | null> {
        const [user] = await executeQuery<User[]>(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );
        return user || null;
    }

    async createUser(user: User): Promise<User> {
        const hashedPass = await bcrypt.hash(user.password, 6);

        const result = await executeQuery<any>(
            'INSERT INTO usuarios (nome, email, password, role) VALUES (?, ?, ?, ?)',
            [user.nome, user.email, hashedPass, user.role]
        );

        return{
            id: result.insertId!,
            nome: user.nome,
            email: user.email,
            password: hashedPass,
            role: user.role
        }
    }
        
}
