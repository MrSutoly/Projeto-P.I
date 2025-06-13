import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { QuizSessionUseCase } from '../../use-case/quizsession_use_case';

@injectable()
export class QuizSessionController {
    constructor(
        @inject(QuizSessionUseCase)
        private quizSessionUseCase: QuizSessionUseCase
    ) {}

    async createSession(req: Request, res: Response): Promise<Response> {
        const session = await this.quizSessionUseCase.createSession(req.body);
        return res.status(201).json(session);
    }

    async joinSession(req: Request, res: Response): Promise<Response> {
        const { code } = req.body;
        const aluno_id = req.user?.id;
        await this.quizSessionUseCase.joinSession(code, aluno_id);
        return res.status(200).json({ message: 'Aluno conectado' });
    }

    async startSession(req: Request, res: Response): Promise<Response> {
        const { sessao_id } = req.params;
        await this.quizSessionUseCase.startSession(Number(sessao_id));
        return res.status(200).json({ message: 'Sessão iniciada' });
    }

    async submitAnswer(req: Request, res: Response): Promise<Response> {
        await this.quizSessionUseCase.submitAnswer(req.body);
        return res.status(200).json({ message: 'Resposta registrada' });
    }

    async nextQuestion(req: Request, res: Response): Promise<Response> {
        const { sessao_id, pergunta_id } = req.params;
        const canAdvance = await this.quizSessionUseCase.canAdvance(Number(sessao_id), Number(pergunta_id));
        if (canAdvance) {
            await this.quizSessionUseCase.nextQuestion(Number(sessao_id), Number(pergunta_id) + 1);
            return res.status(200).json({ message: 'Avançou para próxima pergunta' });
        }
        return res.status(400).json({ message: 'Ainda há alunos para responder' });
    }
}