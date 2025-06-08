import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { StartQuizSessionUseCase } from '../../useCases/start_quiz_session_use_case';
import { SubmitQuizAnswerUseCase } from '../../useCases/submit_quiz_answer_use_case';
import { NextQuizQuestionUseCase } from '../../useCases/next_quiz_question_use_case';
import { IQuizSessionRepository } from '../../repository/i_quiz_session_repository';

export class QuizSessionController {
    async startSession(req: Request, res: Response): Promise<Response> {
        const { quiz_id, turma_id } = req.body;
        const professor_id = req.user.id;

        const startQuizSessionUseCase = container.resolve(StartQuizSessionUseCase);
        const session = await startQuizSessionUseCase.execute({
            quiz_id,
            professor_id,
            turma_id
        });

        return res.status(201).json(session);
    }

    async submitAnswer(req: Request, res: Response): Promise<Response> {
        const { sessao_id, pergunta_id, resposta_id, tempo_resposta } = req.body;
        const aluno_id = req.user.id;

        const submitQuizAnswerUseCase = container.resolve(SubmitQuizAnswerUseCase);
        const answer = await submitQuizAnswerUseCase.execute({
            sessao_id,
            aluno_id,
            pergunta_id,
            resposta_id,
            tempo_resposta
        });

        return res.status(201).json(answer);
    }

    async nextQuestion(req: Request, res: Response): Promise<Response> {
        const { sessao_id } = req.params;
        const professor_id = req.user.id;

        const nextQuizQuestionUseCase = container.resolve(NextQuizQuestionUseCase);
        await nextQuizQuestionUseCase.execute({
            sessao_id: Number(sessao_id),
            professor_id
        });

        return res.status(200).send();
    }

    async getSessionByCode(req: Request, res: Response): Promise<Response> {
        const { codigo } = req.params;
        const quizSessionRepository = container.resolve<IQuizSessionRepository>('QuizSessionRepository');
        
        const session = await quizSessionRepository.getSessionByCode(codigo);
        if (!session) {
            return res.status(404).json({ message: 'Sessão não encontrada' });
        }

        return res.json(session);
    }

    async getConnectedStudents(req: Request, res: Response): Promise<Response> {
        const { sessao_id } = req.params;
        const quizSessionRepository = container.resolve<IQuizSessionRepository>('QuizSessionRepository');
        
        const students = await quizSessionRepository.getConnectedStudents(Number(sessao_id));
        return res.json(students);
    }
} 