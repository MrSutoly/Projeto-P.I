import { User } from '../entities/user_type';

    export interface IUserRepository{
        GetAll():Promise<User[]>;
        GetById(id: number): Promise<User | null>;
        CreateUser(user: User): Promise<User>;
        UserToClass(userId: number, classId: number): Promise<void>;
    }