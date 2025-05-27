import { User } from '../../../shared/util/entities/user_type';

export interface IRegisterRepository {
    findByEmail(email: string): Promise<User | null>;
    createUser(user: User): Promise<User>;
};