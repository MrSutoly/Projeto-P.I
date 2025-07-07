import { injectable } from 'tsyringe';
import { selectFromTable, findOne, insertIntoTable, updateTable } from '../../../shared/database/supabase/db';
import { IQuizSessionRepository } from './i_quizsession_repository';
import { QuizSession, ConnectedStudent, StudentAnswer } from '../type/quizsession_type';

@injectable()
export class QuizSessionRepository implements IQuizSessionRepository {
    async createSession(session: QuizSession): Promise<QuizSession> {
        const { id, ...sessionData } = session;
        const result = await insertIntoTable<QuizSession>('quiz_sessions', {
            ...sessionData,
            status: 'aguardando',
            pergunta_atual: 1
        });
        return result;
    }

    async findSessionByCode(code: string): Promise<QuizSession | null> {
        return await findOne<QuizSession>('quiz_sessions', { codigo_acesso: code });
    }

    async findSessionById(id: number): Promise<QuizSession | null> {
        return await findOne<QuizSession>('quiz_sessions', { id });
    }

    async connectStudent(sessao_id: number, aluno_id: number): Promise<void> {
        await insertIntoTable('connected_students', {
            sessao_id,
            aluno_id,
            status: 'conectado'
        });
    }

    async getConnectedStudents(sessao_id: number): Promise<ConnectedStudent[]> {
        return await selectFromTable<ConnectedStudent>('connected_students', '*', { 
            sessao_id, 
            status: 'conectado' 
        });
    }

    async startSession(sessao_id: number): Promise<void> {
        await updateTable('quiz_sessions', { status: 'em_andamento' }, { id: sessao_id });
    }

    async setCurrentQuestion(sessao_id: number, pergunta_atual: number): Promise<void> {
        await updateTable('quiz_sessions', { pergunta_atual }, { id: sessao_id });
    }

    async submitAnswer(answer: StudentAnswer): Promise<void> {
        const { id, ...answerData } = answer;
        await insertIntoTable('student_answers', answerData);
    }

    async getAnswersForQuestion(sessao_id: number, pergunta_id: number): Promise<StudentAnswer[]> {
        return await selectFromTable<StudentAnswer>('student_answers', '*', { 
            sessao_id, 
            pergunta_id 
        });
    }

    async finishSession(sessao_id: number): Promise<void> {
        await updateTable('quiz_sessions', { status: 'finalizado' }, { id: sessao_id });
    }
}