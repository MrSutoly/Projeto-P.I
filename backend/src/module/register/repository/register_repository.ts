import { User } from '../../../shared/util/entities/user_type';
import { IRegisterRepository } from "./i_register_repository";
import bcrypt from 'bcrypt';
import { findOne, insertIntoTable } from "../../../shared/database/supabase/db";
import { injectable } from "tsyringe";

@injectable()
export class RegisterRepository implements IRegisterRepository {
    async findByEmail(email: string): Promise<User | null> {
        return await findOne<User>('usuarios', { email });
    }

    async createUser(user: User): Promise<User> {
        const hashedPass = await bcrypt.hash(user.password, 6);

        const { id, ...userData } = user;
        const result = await insertIntoTable<User>('usuarios', {
            ...userData,
            password: hashedPass
        });

        return result;
    }
        
}
