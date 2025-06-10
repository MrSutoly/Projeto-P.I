import { injectable } from 'tsyringe';
import { executeQuery } from '../../../shared/database/mysql/db';
import { ITeachRepository } from './i_teach_repository';
import { TeacherSession, StudentResponse, ConnectedStudent } from '../type/teach_type';
import { Class } from '../../../shared/entitie/class_type';
import { Quiz } from '../../../shared/entitie/quiz_type';

@injectable()
export class TeachRepository implements ITeachRepository {
    async findTeacherClasses(professor_id: number): Promise<Class[]> {
        return await executeQuery<Class[]>(
            'SELECT * FROM turmas WHERE professor_id = ?',
            [professor_id]
        );
    }

    async findTeacherQuizzes(professor_id: number): Promise<Quiz[]> {
        return await executeQuery<Quiz[]>(
            'SELECT * FROM quizzes WHERE criado_por = ?',
            [professor_id]
        );
    }
}