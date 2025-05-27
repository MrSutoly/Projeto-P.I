import { User } from '../../../shared/util/entities/user_type';


export interface ILoginRepository{
    findbyEmail(email: string): Promise<User | null>;
    validPassword(password: string, hash: string): Promise<boolean>;
}