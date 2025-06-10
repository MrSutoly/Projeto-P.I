import { injectable, inject } from 'tsyringe';
import { ITeachRepository } from '../repository/i_teach_repository';
import { TeacherSession, StudentResponse, ConnectedStudent } from '../type/teach_type';
import { Class } from '../../../shared/entitie/class_type';
import { Quiz } from '../../../shared/entitie/quiz_type';
import { AppError } from '../../../shared/errors/AppError';

@injectable()
export class TeachUseCase {
    constructor(
        @inject('TeachRepository')
        private teachRepository: ITeachRepository
    ) {}

    async getTeacherClasses(professor_id: number): Promise<Class[]> {
        if (!professor_id) {
            throw new AppError('ID do professor é obrigatório', 400);
        }
        return await this.teachRepository.findTeacherClasses(professor_id);
    }

    async getTeacherQuizzes(professor_id: number): Promise<Quiz[]> {
        if (!professor_id) {
            throw new AppError('ID do professor é obrigatório', 400);
        }
        return await this.teachRepository.findTeacherQuizzes(professor_id);
    }
}