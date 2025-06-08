import { injectable } from 'tsyringe';
import { executeQuery } from '../../../shared/database/mysql/db';
import { Activity, Week, Quiz, Question, Option } from '../types/activity_type';
import { ITeachRepository } from './i_teach_repository';

@injectable()
export class TeachRepository implements ITeachRepository {
    // Atividades
    async createActivity(activity: Activity): Promise<Activity> {
        const result = await executeQuery<any>(
            'INSERT INTO atividades (titulo, descricao, link_constante, semana_numero) VALUES (?, ?, ?, ?)',
            [activity.titulo, activity.descricao, activity.link_constante, activity.semana_numero]
        );
        return { ...activity, id: result.insertId };
    }

    async getAllActivities(): Promise<Activity[]> {
        return await executeQuery<Activity[]>('SELECT * FROM atividades');
    }

    async getActivityById(id: number): Promise<Activity | null> {
        const [activity] = await executeQuery<Activity[]>(
            'SELECT * FROM atividades WHERE id = ?',
            [id]
        );
        return activity || null;
    }

    async updateActivity(id: number, activity: Partial<Activity>): Promise<Activity> {
        const fields = Object.keys(activity)
            .filter(key => activity[key as keyof Activity] !== undefined)
            .map(key => `${key} = ?`);
        const values = Object.values(activity).filter(value => value !== undefined);

        await executeQuery(
            `UPDATE atividades SET ${fields.join(', ')} WHERE id = ?`,
            [...values, id]
        );

        const [updatedActivity] = await executeQuery<Activity[]>(
            'SELECT * FROM atividades WHERE id = ?',
            [id]
        );
        return updatedActivity;
    }

    async deleteActivity(id: number): Promise<void> {
        await executeQuery('DELETE FROM atividades WHERE id = ?', [id]);
    }

    // Semanas
    async createWeek(week: Week): Promise<Week> {
        await executeQuery(
            'INSERT INTO semanas (numero, data_inicio, data_fim) VALUES (?, ?, ?)',
            [week.numero, week.data_inicio, week.data_fim]
        );
        return week;
    }

    async getAllWeeks(): Promise<Week[]> {
        return await executeQuery<Week[]>('SELECT * FROM semanas');
    }

    async getWeekByNumber(numero: number): Promise<Week | null> {
        const [week] = await executeQuery<Week[]>(
            'SELECT * FROM semanas WHERE numero = ?',
            [numero]
        );
        return week || null;
    }

    async updateWeek(numero: number, week: Partial<Week>): Promise<Week> {
        const fields = Object.keys(week)
            .filter(key => week[key as keyof Week] !== undefined)
            .map(key => `${key} = ?`);
        const values = Object.values(week).filter(value => value !== undefined);

        await executeQuery(
            `UPDATE semanas SET ${fields.join(', ')} WHERE numero = ?`,
            [...values, numero]
        );

        const [updatedWeek] = await executeQuery<Week[]>(
            'SELECT * FROM semanas WHERE numero = ?',
            [numero]
        );
        return updatedWeek;
    }

    async deleteWeek(numero: number): Promise<void> {
        await executeQuery('DELETE FROM semanas WHERE numero = ?', [numero]);
    }

    // Quizzes
    async createQuiz(quiz: Quiz): Promise<Quiz> {
        const result = await executeQuery<any>(
            'INSERT INTO quizzes (titulo, tipo, atividade_id) VALUES (?, ?, ?)',
            [quiz.titulo, quiz.tipo, quiz.atividade_id]
        );
        return { ...quiz, id: result.insertId };
    }

    async getAllQuizzes(): Promise<Quiz[]> {
        return await executeQuery<Quiz[]>('SELECT * FROM quizzes');
    }

    async getQuizById(id: number): Promise<Quiz | null> {
        const [quiz] = await executeQuery<Quiz[]>(
            'SELECT * FROM quizzes WHERE id = ?',
            [id]
        );
        return quiz || null;
    }

    async updateQuiz(id: number, quiz: Partial<Quiz>): Promise<Quiz> {
        const fields = Object.keys(quiz)
            .filter(key => quiz[key as keyof Quiz] !== undefined)
            .map(key => `${key} = ?`);
        const values = Object.values(quiz).filter(value => value !== undefined);

        await executeQuery(
            `UPDATE quizzes SET ${fields.join(', ')} WHERE id = ?`,
            [...values, id]
        );

        const [updatedQuiz] = await executeQuery<Quiz[]>(
            'SELECT * FROM quizzes WHERE id = ?',
            [id]
        );
        return updatedQuiz;
    }

    async deleteQuiz(id: number): Promise<void> {
        await executeQuery('DELETE FROM quizzes WHERE id = ?', [id]);
    }

    // Perguntas
    async createQuestion(question: Question): Promise<Question> {
        const result = await executeQuery<any>(
            'INSERT INTO perguntas (texto, quiz_id) VALUES (?, ?)',
            [question.texto, question.quiz_id]
        );
        return { ...question, id: result.insertId };
    }

    async getQuestionsByQuizId(quizId: number): Promise<Question[]> {
        return await executeQuery<Question[]>(
            'SELECT * FROM perguntas WHERE quiz_id = ?',
            [quizId]
        );
    }

    async updateQuestion(id: number, question: Partial<Question>): Promise<Question> {
        const fields = Object.keys(question)
            .filter(key => question[key as keyof Question] !== undefined)
            .map(key => `${key} = ?`);
        const values = Object.values(question).filter(value => value !== undefined);

        await executeQuery(
            `UPDATE perguntas SET ${fields.join(', ')} WHERE id = ?`,
            [...values, id]
        );

        const [updatedQuestion] = await executeQuery<Question[]>(
            'SELECT * FROM perguntas WHERE id = ?',
            [id]
        );
        return updatedQuestion;
    }

    async deleteQuestion(id: number): Promise<void> {
        await executeQuery('DELETE FROM perguntas WHERE id = ?', [id]);
    }

    // Opções
    async createOption(option: Option): Promise<Option> {
        const result = await executeQuery<any>(
            'INSERT INTO opcoes (texto, correta, pergunta_id) VALUES (?, ?, ?)',
            [option.texto, option.correta, option.pergunta_id]
        );
        return { ...option, id: result.insertId };
    }

    async getOptionsByQuestionId(questionId: number): Promise<Option[]> {
        return await executeQuery<Option[]>(
            'SELECT * FROM opcoes WHERE pergunta_id = ?',
            [questionId]
        );
    }

    async updateOption(id: number, option: Partial<Option>): Promise<Option> {
        const fields = Object.keys(option)
            .filter(key => option[key as keyof Option] !== undefined)
            .map(key => `${key} = ?`);
        const values = Object.values(option).filter(value => value !== undefined);

        await executeQuery(
            `UPDATE opcoes SET ${fields.join(', ')} WHERE id = ?`,
            [...values, id]
        );

        const [updatedOption] = await executeQuery<Option[]>(
            'SELECT * FROM opcoes WHERE id = ?',
            [id]
        );
        return updatedOption;
    }

    async deleteOption(id: number): Promise<void> {
        await executeQuery('DELETE FROM opcoes WHERE id = ?', [id]);
    }
} 