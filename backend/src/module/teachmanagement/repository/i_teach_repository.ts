import { TeacherSession, StudentResponse, ConnectedStudent } from '../type/teach_type';
import { Class } from '../../../shared/entitie/class_type';
import { Quiz } from '../../../shared/entitie/quiz_type';

export interface ITeachRepository {
    
    findTeacherClasses(professor_id: number): Promise<Class[]>;
    
    findTeacherQuizzes(professor_id: number): Promise<Quiz[]>;
    
}