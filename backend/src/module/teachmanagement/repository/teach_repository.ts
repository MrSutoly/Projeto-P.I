import { injectable } from 'tsyringe';
import { selectFromTable } from '../../../shared/database/supabase/db';
import { ITeachRepository } from './i_teach_repository';
import { TeacherSession, StudentResponse, ConnectedStudent } from '../type/teach_type';
import { Class } from '../../../shared/util/entities/class_type';
import { Quiz } from '../../../shared/util/entities/quiz_type';

@injectable()
export class TeachRepository implements ITeachRepository {
    async findTeacherClasses(professor_id: number): Promise<Class[]> {
        return await selectFromTable<Class>('turmas', '*', { professor_id });
    }

    async findAllQuizzes(): Promise<Quiz[]> {
        return await selectFromTable<Quiz>('quizzes');
    }
}