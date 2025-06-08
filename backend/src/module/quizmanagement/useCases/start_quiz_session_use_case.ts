import { injectable, inject } from 'tsyringe';
import { IQuizSessionRepository } from '../repository/i_quiz_session_repository';
import { IQuizRepository } from '../repository/i_quiz_repository';
import { ITurmaRepository } from '../../management/repository/i_turma_repository';
import { AppError } from '../../../shared/errors/AppError';
import { QuizSession } from '../types/quiz_session_type';

interface IRequest {
    quiz_id: number;
    professor_id: number;
    turma_id: number;
}

@injectable()
export class StartQuizSessionUseCase {
    constructor(
        @inject('QuizSessionRepository')
        private quizSessionRepository: IQuizSessionRepository,
        @inject('QuizRepository')
        private quizRepository: IQuizRepository,
        @inject('TurmaRepository')
        private turmaRepository: ITurmaRepository
    ) {}

    async execute({ quiz_id, professor_id, turma_id }: IRequest): Promise<QuizSession> {
        // Verifica se o quiz existe
        const quiz = await this.quizRepository.findById(quiz_id);
        if (!quiz) {
            throw new AppError('Quiz não encontrado', 404);
        }

        // Verifica se a turma existe
        const turma = await this.turmaRepository.findById(turma_id);
        if (!turma) {
            throw new AppError('Turma não encontrada', 404);
        }

        // Verifica se o professor é o dono da turma
        if (turma.professor_id !== professor_id) {
            throw new AppError('Apenas o professor da turma pode iniciar uma sessão de quiz', 403);
        }

        // Verifica se já existe uma sessão ativa para esta turma
        const sessaoAtiva = await this.quizSessionRepository.getActiveSessionByTurma(turma_id);
        if (sessaoAtiva) {
            throw new AppError('Já existe uma sessão de quiz ativa para esta turma', 400);
        }

        // Gera um código de acesso único
        let codigo_acesso: string;
        let sessionExists: QuizSession | null;
        
        do {
            codigo_acesso = Math.random().toString(36).substring(2, 8).toUpperCase();
            sessionExists = await this.quizSessionRepository.getSessionByCode(codigo_acesso);
        } while (sessionExists);

        // Cria a sessão
        const session = await this.quizSessionRepository.createSession({
            quiz_id,
            professor_id,
            turma_id,
            status: 'aguardando',
            pergunta_atual: 1,
            data_inicio: new Date(),
            codigo_acesso
        });

        return session;
    }
} 