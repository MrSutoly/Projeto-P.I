import { injectable } from 'tsyringe';
import { executeQuery } from '../../../shared/database/mysql/db';
import { IQuizSessionRepository } from './i_quizsession_repository';
import { QuizSession, ConnectedStudent, StudentAnswer } from '../type/quizsession_type';

@injectable()
export class QuizSessionRepository implements IQuizSessionRepository {
    async createSession(session: QuizSession): Promise<QuizSession> {
        const result = await executeQuery<{ insertId: number }>(
            'INSERT INTO quiz_sessions (quiz_id, professor_id, turma_id, status, pergunta_atual, codigo_acesso) VALUES (?, ?, ?, ?, ?, ?)',
            [session.quiz_id, session.professor_id, session.turma_id, 'aguardando', 1, session.codigo_acesso]
        );
        return { ...session, id: result.insertId, status: 'aguardando', pergunta_atual: 1 };
    }

    async findSessionByCode(code: string): Promise<QuizSession | null> {
        const [session] = await executeQuery<QuizSession[]>(
            'SELECT * FROM quiz_sessions WHERE codigo_acesso = ?',
            [code]
        );
        return session || null;
    }

    async findSessionById(id: number): Promise<QuizSession | null> {
        const [session] = await executeQuery<QuizSession[]>(
            'SELECT * FROM quiz_sessions WHERE id = ?',
            [id]
        );
        return session || null;
    }

    async connectStudent(sessao_id: number, aluno_id: number): Promise<void> {
        await executeQuery(
            'INSERT IGNORE INTO quiz_alunos_conectados (sessao_id, aluno_id, status) VALUES (?, ?, "conectado")',
            [sessao_id, aluno_id]
        );
    }

    async getConnectedStudents(sessao_id: number): Promise<ConnectedStudent[]> {
        return await executeQuery<ConnectedStudent[]>(
            'SELECT * FROM quiz_alunos_conectados WHERE sessao_id = ? AND status = "conectado"',
            [sessao_id]
        );
    }

    async startSession(sessao_id: number): Promise<void> {
        await executeQuery(
            'UPDATE quiz_sessions SET status = "em_andamento" WHERE id = ?',
            [sessao_id]
        );
    }

    async setCurrentQuestion(sessao_id: number, pergunta_atual: number): Promise<void> {
        await executeQuery(
            'UPDATE quiz_sessions SET pergunta_atual = ? WHERE id = ?',
            [pergunta_atual, sessao_id]
        );
    }

    async submitAnswer(answer: StudentAnswer): Promise<void> {
        await executeQuery(
            'INSERT INTO quiz_respostas_alunos (sessao_id, aluno_id, pergunta_id, resposta_id, tempo_resposta) VALUES (?, ?, ?, ?, ?)',
            [answer.sessao_id, answer.aluno_id, answer.pergunta_id, answer.resposta_id, answer.tempo_resposta]
        );
    }

    async getAnswersForQuestion(sessao_id: number, pergunta_id: number): Promise<StudentAnswer[]> {
        return await executeQuery<StudentAnswer[]>(
            'SELECT * FROM quiz_respostas_alunos WHERE sessao_id = ? AND pergunta_id = ?',
            [sessao_id, pergunta_id]
        );
    }

    async finishSession(sessao_id: number): Promise<void> {
        await executeQuery(
            'UPDATE quiz_sessions SET status = "finalizado" WHERE id = ?',
            [sessao_id]
        );
    }
}