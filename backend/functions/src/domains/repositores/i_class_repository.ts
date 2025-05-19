import { Class } from '../../domains/entities/class_type';

export interface IClassRepository {
    CreateClass(classData: Class): Promise<Class>;
}