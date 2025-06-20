import { injectable, inject } from 'tsyringe';
import { IQuizSessionRepository } from '../repository/i_quizsession_repository';
import { QuizSession, StudentAnswer } from '../type/quizsession_type';
import { AppError } from '../../../shared/errors/AppError';
import { IManagementRepository } from '../../management/repository/i_management_repository';

function generateAccessCode(length: number = 6): string {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

@injectable()
export class QuizSessionUseCase {
    constructor(
        @inject('QuizSessionRepository')
        private quizSessionRepository: IQuizSessionRepository,
        @inject('ManagementRepository')
        private managementRepository: IManagementRepository
    ) {}

    async createSession(data: { quiz_id: number; professor_id: number; turma_id: number }): Promise<QuizSession> {
        const quiz = await this.managementRepository.findQuizById(data.quiz_id);
        if (!quiz) {
            throw new AppError('Quiz não encontrado.', 404);
        }

        const turma = await this.managementRepository.findClassById(data.turma_id);
        if (!turma) {
            throw new AppError('Turma não encontrada.', 404);
        }

        const codigo_acesso = generateAccessCode();
        
        const sessionData: QuizSession = {
            ...data,
            status: 'aguardando',
            pergunta_atual: 1,
            codigo_acesso,
        };

        const session = await this.quizSessionRepository.createSession(sessionData);
        return session;
    }

    async joinSession(code: string, aluno_id: number): Promise<void> {
        const session = await this.quizSessionRepository.findSessionByCode(code);

        if (!session) {
            throw new AppError('Sessão de quiz não encontrada.', 404);
        }

        if (session.status !== 'aguardando') {
            throw new AppError('Esta sessão de quiz não está mais aceitando novos alunos.', 403);
        }

        if (!session.id) {
            throw new AppError('ID da sessão inválido.', 500);
        }

        await this.quizSessionRepository.connectStudent(session.id, aluno_id);
    }

    async startSession(sessao_id: number): Promise<void> {
        const session = await this.quizSessionRepository.findSessionById(sessao_id);
        if (!session) {
            throw new AppError('Sessão de quiz não encontrada.', 404);
        }
        if (session.status !== 'aguardando') {
            throw new AppError('A sessão não pode ser iniciada pois não está aguardando jogadores.', 403);
        }
        await this.quizSessionRepository.startSession(sessao_id);
    }

    async submitAnswer(answer: StudentAnswer): Promise<void> {
        const session = await this.quizSessionRepository.findSessionById(answer.sessao_id);
        if (!session) {
            throw new AppError('Sessão de quiz não encontrada.', 404);
        }
        if (session.status !== 'em_andamento') {
            throw new AppError('Não é possível registrar resposta. A sessão não está em andamento.', 403);
        }
        if (session.pergunta_atual !== answer.pergunta_id) {
            throw new AppError('Não é possível registrar resposta para esta pergunta no momento.', 403);
        }
        await this.quizSessionRepository.submitAnswer(answer);
    }

    async nextQuestion(sessao_id: number, proxima_pergunta: number): Promise<void> {
        await this.quizSessionRepository.setCurrentQuestion(sessao_id, proxima_pergunta);
    }

    async canAdvance(sessao_id: number, pergunta_id: number): Promise<boolean> {
        const connectedStudents = await this.quizSessionRepository.getConnectedStudents(sessao_id);
        const answeredStudents = await this.quizSessionRepository.getAnswersForQuestion(sessao_id, pergunta_id);

        return connectedStudents.length === answeredStudents.length;
    }

    async finishSession(sessao_id: number): Promise<void> {
        const session = await this.quizSessionRepository.findSessionById(sessao_id);
        if (!session) {
            throw new AppError('Sessão de quiz não encontrada.', 404);
        }
        await this.quizSessionRepository.finishSession(sessao_id);
    }
}
