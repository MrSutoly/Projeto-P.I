import { User } from '../../../shared/util/entities/user_type';
import { Class } from '../../../shared/util/entities/class_type';
export interface IManagementRepository {
    findById(id: number): Promise<User | null>;
    findAll(): Promise<User[]>;
    findUserByClass(ClassId: number): Promise<User[]>;
    create(user: User): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: number): Promise<void>;

    findClassById(id: number): Promise<Class | null>;
    findAllClasses(): Promise<Class[]>;
    createClass(classData: Class): Promise<Class>;
    updateClass(classData: Class): Promise<Class>;
    deleteClass(id: number): Promise<void>;
}