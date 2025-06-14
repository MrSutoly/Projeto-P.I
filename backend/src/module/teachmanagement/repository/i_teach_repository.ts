import { TeacherSession, StudentResponse, ConnectedStudent } from '../type/teach_type';
import { Class } from '../../../shared/util/entities/class_type';
import { Quiz } from '../../../shared/util/entities/quiz_type';

export interface ITeachRepository {
    
    findTeacherClasses(professor_id: number): Promise<Class[]>;
    
    findAllQuizzes(): Promise<Quiz[]>;
    
}