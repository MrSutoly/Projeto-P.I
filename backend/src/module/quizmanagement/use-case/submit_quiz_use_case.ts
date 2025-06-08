import { injectable, inject } from 'tsyringe';
import { IQuizRepository } from '../repository/i_quiz_repository';
import { QuizResult, QuizResponse } from '../../../shared/entitie/quiz_type';

@injectable()
export class SubmitQuizUseCase {
    constructor(
        @inject('QuizRepository')
        private quizRepository: IQuizRepository
    ) {}

    async execute(data: {
        user_id: number;
        quiz_id: number;
        respostas: Array<{
            pergunta_id: number;
            opcao_id: number;
        }>;
    }): Promise<QuizResult> {
        // Validate input
        if (!data.user_id || !data.quiz_id || !data.respostas.length) {
            throw new Error('Dados incompletos');
        }

        // Submit each answer
        for (const resposta of data.respostas) {
            await this.quizRepository.submitQuizResponse({
                usuario_id: data.user_id,
                quiz_id: data.quiz_id,
                pergunta_id: resposta.pergunta_id,
                opcao_id: resposta.opcao_id
            });
        }

        // Get results
        const results = await this.quizRepository.getQuizResults(
            data.quiz_id,
            data.user_id
        );

        return results;
    }
}