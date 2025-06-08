import { injectable, inject } from 'tsyringe';
import { IQuizSessionRepository } from '../repository/i_quiz_session_repository';
import { IQuizRepository } from '../repository/i_quiz_repository';
import { AppError } from '../../../shared/errors/AppError';
import { QuizRespostaAluno } from '../types/quiz_session_type';

interface IRequest {
    sessao_id: number;
    aluno_id: number;
    pergunta_id: number;
    resposta_id: number;
    tempo_resposta: number;
}

@injectable()
export class SubmitQuizAnswerUseCase {
    constructor(
        @inject('QuizSessionRepository')
        private quizSessionRepository: IQuizSessionRepository,
        @inject('QuizRepository')
        private quizRepository: IQuizRepository
    ) {}

    async execute({ sessao_id, aluno_id, pergunta_id, resposta_id, tempo_resposta }: IRequest): Promise<QuizRespostaAluno> {
        // Verifica se a sessão existe e está em andamento
        const session = await this.quizSessionRepository.getSessionById(sessao_id);
        if (!session) {
            throw new AppError('Sessão não encontrada', 404);
        }

        if (session.status !== 'em_andamento') {
            throw new AppError('Sessão não está em andamento', 400);
        }

        // Verifica se o aluno está conectado na sessão
        const alunoConectado = await this.quizSessionRepository.isStudentConnected(sessao_id, aluno_id);
        if (!alunoConectado) {
            throw new AppError('Aluno não está conectado na sessão', 400);
        }

        // Verifica se a pergunta atual corresponde à pergunta respondida
        if (session.pergunta_atual !== pergunta_id) {
            throw new AppError('Pergunta não está disponível para resposta', 400);
        }

        // Verifica se o aluno já respondeu esta pergunta
        const respostaExistente = await this.quizSessionRepository.getStudentAnswer(sessao_id, aluno_id, pergunta_id);
        if (respostaExistente) {
            throw new AppError('Aluno já respondeu esta pergunta', 400);
        }

        // Verifica se a resposta pertence à pergunta
        const quiz = await this.quizRepository.findById(session.quiz_id);
        if (!quiz) {
            throw new AppError('Quiz não encontrado', 404);
        }

        const respostaValida = await this.quizRepository.isValidAnswer(pergunta_id, resposta_id);
        if (!respostaValida) {
            throw new AppError('Resposta inválida para esta pergunta', 400);
        }

        // Salva a resposta do aluno
        const answer = await this.quizSessionRepository.saveStudentAnswer({
            sessao_id,
            aluno_id,
            pergunta_id,
            resposta_id,
            tempo_resposta
        });

        return answer;
    }
} 