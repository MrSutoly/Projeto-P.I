import { inject, injectable } from 'tsyringe';
import { IQuizRepository } from '../repository/i_quiz_repository';
import { Quiz, Question, Option } from '../../../shared/entitie/quiz_type';
import { AppError } from '../../../shared/errors/AppError';

@injectable()
export class QuizUseCase {
    constructor(
        @inject('QuizRepository')
        private quizRepository: IQuizRepository
    ) {}

    async createQuiz(quizData: Omit<Quiz, 'id'>): Promise<Quiz> {
        try {
            this.validateQuizData(quizData);

            const quiz = await this.quizRepository.createQuiz(quizData);

            for (const pergunta of quizData.perguntas) {
                const question = await this.quizRepository.createQuestion({
                    ...pergunta,
                    quiz_id: quiz.id
                });

                for (const opcao of pergunta.opcoes) {
                    await this.quizRepository.createOption({
                        ...opcao,
                        pergunta_id: question.id
                    });
                }
            }

            return await this.quizRepository.findFullQuizById(quiz.id) as Quiz;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Erro ao criar quiz', 500);
        }
    }

    async findQuizById(id: number): Promise<Quiz | null> {
        try {
            if (!id || isNaN(id)) {
                throw new AppError('ID inválido', 400);
            }

            const quiz = await this.quizRepository.findFullQuizById(id);
            
            if (!quiz) {
                throw new AppError('Quiz não encontrado', 404);
            }

            return quiz;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Erro ao buscar quiz', 500);
        }
    }

    async findAllQuizzes(): Promise<Quiz[]> {
        try {
            return await this.quizRepository.findAllQuizzes();
        } catch (error) {
            throw new AppError('Erro ao listar quizzes', 500);
        }
    }

    private validateQuizData(quizData: Omit<Quiz, 'id'>): void {
        if (!quizData.titulo || quizData.titulo.trim().length === 0) {
            throw new AppError('Título do quiz é obrigatório', 400);
        }

        if (!quizData.tipo || !['multipla_escolha', 'verdadeiro_falso'].includes(quizData.tipo)) {
            throw new AppError('Tipo de quiz inválido', 400);
        }

        if (!quizData.atividade_id || isNaN(quizData.atividade_id)) {
            throw new AppError('ID da atividade é obrigatório', 400);
        }

        if (!Array.isArray(quizData.perguntas) || quizData.perguntas.length === 0) {
            throw new AppError('O quiz deve ter pelo menos uma pergunta', 400);
        }

        for (const pergunta of quizData.perguntas) {
            if (!pergunta.texto || pergunta.texto.trim().length === 0) {
                throw new AppError('Texto da pergunta é obrigatório', 400);
            }

            if (!Array.isArray(pergunta.opcoes) || pergunta.opcoes.length === 0) {
                throw new AppError('A pergunta deve ter pelo menos uma opção', 400);
            }

            for (const opcao of pergunta.opcoes) {
                if (!opcao.texto || opcao.texto.trim().length === 0) {
                    throw new AppError('Texto da opção é obrigatório', 400);
                }
            }
        }
    }
} 