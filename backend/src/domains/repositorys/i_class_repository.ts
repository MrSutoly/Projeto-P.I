import { Class } from '../entities/class_type';

export interface IClassRepository {
    CreateClass(classData: Class): Promise<Class>;
}