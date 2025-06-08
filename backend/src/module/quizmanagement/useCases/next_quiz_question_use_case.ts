import { injectable, inject } from 'tsyringe';
import { IQuizSessionRepository } from '../repository/i_quiz_session_repository';
import { IQuizRepository } from '../repository/i_quiz_repository';
import { ITurmaRepository } from '../../management/repository/i_turma_repository';
import { AppError } from '../../../shared/errors/AppError';

interface IRequest {
    sessao_id: number;
    professor_id: number;
}

@injectable()
export class NextQuizQuestionUseCase {
    constructor(
        @inject('QuizSessionRepository')
        private quizSessionRepository: IQuizSessionRepository,
        @inject('QuizRepository')
        private quizRepository: IQuizRepository,
        @inject('TurmaRepository')
        private turmaRepository: ITurmaRepository
    ) {}

    async execute({ sessao_id, professor_id }: IRequest): Promise<void> {
        // Verifica se a sessão existe
        const session = await this.quizSessionRepository.getSessionById(sessao_id);
        if (!session) {
            throw new AppError('Sessão não encontrada', 404);
        }

        // Verifica se o professor é o dono da sessão
        if (session.professor_id !== professor_id) {
            throw new AppError('Apenas o professor da sessão pode avançar as perguntas', 403);
        }

        // Verifica se a sessão está em andamento
        if (session.status !== 'em_andamento') {
            throw new AppError('Sessão não está em andamento', 400);
        }

        // Verifica se há alunos conectados
        const totalAlunos = await this.quizSessionRepository.countConnectedStudents(sessao_id);
        if (totalAlunos === 0) {
            throw new AppError('Não há alunos conectados na sessão', 400);
        }

        // Verifica se todos os alunos conectados responderam a pergunta atual
        const totalRespostas = await this.quizSessionRepository.countStudentAnswers(sessao_id, session.pergunta_atual);
        if (totalRespostas < totalAlunos) {
            throw new AppError('Ainda há alunos que não responderam a pergunta atual', 400);
        }

        // Busca o quiz para saber o total de perguntas
        const quiz = await this.quizRepository.findById(session.quiz_id);
        if (!quiz) {
            throw new AppError('Quiz não encontrado', 404);
        }

        // Verifica se é a última pergunta
        if (session.pergunta_atual >= quiz.total_perguntas) {
            // Finaliza a sessão
            await this.quizSessionRepository.finalizeSession(sessao_id);
            
            // Notifica os alunos sobre o fim do quiz
            await this.notifyStudents(sessao_id, 'finalizado');
        } else {
            // Avança para a próxima pergunta
            await this.quizSessionRepository.updateCurrentQuestion(sessao_id, session.pergunta_atual + 1);
            
            // Notifica os alunos sobre a nova pergunta
            await this.notifyStudents(sessao_id, 'nova_pergunta');
        }
    }

    private async notifyStudents(sessaoId: number, tipo: 'nova_pergunta' | 'finalizado'): Promise<void> {
        // Aqui você implementaria a lógica de notificação em tempo real
        // Por exemplo, usando WebSocket ou Server-Sent Events
        // Por enquanto, apenas um placeholder
        console.log(`Notificando alunos da sessão ${sessaoId} sobre ${tipo}`);
    }
} 