import { injectable } from 'tsyringe';
import { executeQuery } from '../../../shared/database/mysql/db';
import { IQuizRepository } from './i_quiz_repository';
import { Quiz, Question, Option } from '../../../shared/entitie/quiz_type'; 
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
}