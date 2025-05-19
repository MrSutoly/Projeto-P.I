import { injectable } from 'tsyringe';
import { executeQuery } from "../../../shared/database/mysql/db";
import { User } from "../entitie/user_type";
import { ILoginRepository } from "./i_login_repository";
import bcrypt from 'bcrypt';

@injectable()
export class LoginRepository implements ILoginRepository {    
    async findbyEmail(email: string): Promise<User | null> {
        const [user] = await executeQuery<User[]>(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );
        return user || null;
    }

    async validPassword(password: string, hash: string): Promise<boolean> {

        const validPass = await bcrypt.compare(password, hash);

        if(!validPass){
            return false;
        }else{
            return true;
        }
    }
}