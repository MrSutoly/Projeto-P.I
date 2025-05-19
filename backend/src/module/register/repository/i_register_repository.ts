import { UserRegi } from '../entitie/user_type';

export interface IRegisterRepository {
    findByEmail(email: string): Promise<UserRegi | null>;
    createUser(user: UserRegi): Promise<UserRegi>;
};