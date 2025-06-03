import { injectable, inject } from 'tsyringe';
import { IQuizRepository } from '../repository/i_quiz_repository';
import { Quiz } from '../../../shared/entitie/quiz_type';

@injectable()
export class ShowQuizUseCase {
    constructor(
        @inject('QuizRepository')
        private quizRepository: IQuizRepository
    ) {}

    async execute(quizId: number): Promise<Quiz> {
        if (!quizId) {
            throw new Error('Quiz ID é obrigatório');
        }

        const quiz = await this.quizRepository.findQuizById(quizId);

        if (!quiz) {
            throw new Error('Quiz não encontrado');
        }

        return quiz;
    }
}