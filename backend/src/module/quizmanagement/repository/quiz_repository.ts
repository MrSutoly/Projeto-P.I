import { injectable } from 'tsyringe';
import { executeQuery } from '../../../shared/database/mysql/db';
import { IQuizRepository } from './i_quiz_repository';
import { 
    Quiz, 
    Question, 
    Option, 
    QuizResponse, 
    QuizResult 
} from '../../../shared/entitie/quiz_type';
@injectable()
export class QuizRepository implements IQuizRepository {
    async createQuiz(quiz: Quiz): Promise<Quiz> {
        const result = await executeQuery<{ insertId: number }>(
            'INSERT INTO quizzes (titulo, tipo, atividade_id) VALUES (?, ?, ?)',
            [quiz.titulo, quiz.tipo, quiz.atividade_id]
        );
        return { ...quiz, id: result.insertId };
    }

    async createQuestion(question: Question): Promise<Question> {
        const result = await executeQuery<{ insertId: number }>(
            'INSERT INTO perguntas (texto, quiz_id) VALUES (?, ?)',
            [question.texto, question.quiz_id]
        );
        return { ...question, id: result.insertId };
    }

    async createOption(option: Option): Promise<Option> { 
        const result = await executeQuery<{ insertId: number }>(
            'INSERT INTO opcoes (texto, correta, pergunta_id) VALUES (?, ?, ?)',
            [option.texto, option.correta, option.pergunta_id]
        );
        return { ...option, id: result.insertId };
    }

    async findQuizById(id: number): Promise<Quiz | null> {
        const [quiz] = await executeQuery<Quiz[]>(
            'SELECT * FROM quizzes WHERE id = ?',
            [id]
        );
        return quiz || null;
    }

    async findAllQuizzes(): Promise<Quiz[]> {
        return await executeQuery<Quiz[]>(
            'SELECT * FROM quizzes'
        );
    }

    async findFullQuizById(id: number): Promise<Quiz | null> {
        const [quiz] = await executeQuery<Quiz[]>(
            'SELECT * FROM quizzes WHERE id = ?',
            [id]
        );

        if (!quiz) return null;

        const perguntas = await executeQuery<Question[]>(
            'SELECT * FROM perguntas WHERE quiz_id = ?',
            [quiz.id]
        );

        for (let pergunta of perguntas) {
            const opcoes = await executeQuery<Option[]>(
                'SELECT * FROM opcoes WHERE pergunta_id = ?',
                [pergunta.id]
            );
            pergunta.opcoes = opcoes;
        }

        return { ...quiz, perguntas };
    }

    async submitQuizResponse(response: QuizResponse): Promise<QuizResponse> {
        const result = await executeQuery<{ insertId: number }>(
            'INSERT INTO respostas (usuario_id, pergunta_id, opcao_id) VALUES (?, ?, ?)',
            [response.usuario_id, response.pergunta_id, response.opcao_id]
        );
        return { ...response, id: result.insertId };
    }

    async getQuizResults(quizId: number, userId: number): Promise<QuizResult> {
        const [result] = await executeQuery<QuizResult[]>(`
            SELECT 
                COUNT(DISTINCT p.id) as total_perguntas,
                SUM(CASE WHEN o.correta = 1 THEN 1 ELSE 0 END) as respostas_corretas
            FROM perguntas p
            LEFT JOIN respostas r ON p.id = r.pergunta_id AND r.usuario_id = ?
            LEFT JOIN opcoes o ON r.opcao_id = o.id
            WHERE p.quiz_id = ?
        `, [userId, quizId]);

        return {
            total_perguntas: result.total_perguntas,
            respostas_corretas: result.respostas_corretas,
            pontuacao: (result.respostas_corretas / result.total_perguntas) * 100,
            completude: result.total_perguntas === result.respostas_corretas
        };
    }

    async checkAnswer(optionId: number): Promise<boolean> {
        const [result] = await executeQuery<{ correta: boolean }[]>(
            'SELECT correta FROM opcoes WHERE id = ?',
            [optionId]
        );
        return result?.correta || false;
    }

    async savePontuacao(pontuacao: {
        pontos: number;
        completude: boolean;
        class_id: number;
        resposta_id: number;
    }): Promise<void> {
        await executeQuery(
            'INSERT INTO pontuacoes (pontos, completude, class_id, resposta_id) VALUES (?, ?, ?, ?)',
            [pontuacao.pontos, pontuacao.completude, pontuacao.class_id, pontuacao.resposta_id]
        );
    }
}