import { injectable } from 'tsyringe';
import { executeQuery } from '../../../shared/database/mysql/db';
import { QuizSession, QuizRespostaAluno, QuizAlunoConectado } from '../types/quiz_session_type';
import { IQuizSessionRepository } from './i_quiz_session_repository';

@injectable()
export class QuizSessionRepository implements IQuizSessionRepository {
    // Sessões
    async createSession(session: QuizSession): Promise<QuizSession> {
        const result = await executeQuery<any>(
            'INSERT INTO quiz_sessions (quiz_id, professor_id, turma_id, status, pergunta_atual, data_inicio, codigo_acesso) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [session.quiz_id, session.professor_id, session.turma_id, session.status, session.pergunta_atual, session.data_inicio, session.codigo_acesso]
        );
        return { ...session, id: result.insertId };
    }

    async getSessionById(id: number): Promise<QuizSession | null> {
        const [session] = await executeQuery<QuizSession[]>(
            'SELECT * FROM quiz_sessions WHERE id = ?',
            [id]
        );
        return session || null;
    }

    async getSessionByCode(codigo: string): Promise<QuizSession | null> {
        const [session] = await executeQuery<QuizSession[]>(
            'SELECT * FROM quiz_sessions WHERE codigo_acesso = ?',
            [codigo]
        );
        return session || null;
    }

    async updateSessionStatus(id: number, status: QuizSession['status']): Promise<void> {
        await executeQuery(
            'UPDATE quiz_sessions SET status = ? WHERE id = ?',
            [status, id]
        );
    }

    async updateCurrentQuestion(id: number, perguntaAtual: number): Promise<void> {
        await executeQuery(
            'UPDATE quiz_sessions SET pergunta_atual = ? WHERE id = ?',
            [perguntaAtual, id]
        );
    }

    async finalizeSession(id: number): Promise<void> {
        await executeQuery(
            'UPDATE quiz_sessions SET status = "finalizado", data_fim = NOW() WHERE id = ?',
            [id]
        );
    }

    // Respostas dos alunos
    async saveStudentAnswer(answer: QuizRespostaAluno): Promise<QuizRespostaAluno> {
        const result = await executeQuery<any>(
            'INSERT INTO quiz_respostas_alunos (sessao_id, aluno_id, pergunta_id, resposta_id, tempo_resposta) VALUES (?, ?, ?, ?, ?)',
            [answer.sessao_id, answer.aluno_id, answer.pergunta_id, answer.resposta_id, answer.tempo_resposta]
        );
        return { ...answer, id: result.insertId };
    }

    async getStudentAnswers(sessaoId: number, perguntaId: number): Promise<QuizRespostaAluno[]> {
        return await executeQuery<QuizRespostaAluno[]>(
            'SELECT * FROM quiz_respostas_alunos WHERE sessao_id = ? AND pergunta_id = ?',
            [sessaoId, perguntaId]
        );
    }

    async countStudentAnswers(sessaoId: number, perguntaId: number): Promise<number> {
        const [result] = await executeQuery<any[]>(
            'SELECT COUNT(*) as total FROM quiz_respostas_alunos WHERE sessao_id = ? AND pergunta_id = ?',
            [sessaoId, perguntaId]
        );
        return result.total;
    }

    // Alunos conectados
    async connectStudent(connection: QuizAlunoConectado): Promise<QuizAlunoConectado> {
        const result = await executeQuery<any>(
            'INSERT INTO quiz_alunos_conectados (sessao_id, aluno_id, status) VALUES (?, ?, ?)',
            [connection.sessao_id, connection.aluno_id, connection.status]
        );
        return { ...connection, id: result.insertId };
    }

    async disconnectStudent(sessaoId: number, alunoId: number): Promise<void> {
        await executeQuery(
            'UPDATE quiz_alunos_conectados SET status = "desconectado" WHERE sessao_id = ? AND aluno_id = ?',
            [sessaoId, alunoId]
        );
    }

    async getConnectedStudents(sessaoId: number): Promise<QuizAlunoConectado[]> {
        return await executeQuery<QuizAlunoConectado[]>(
            'SELECT * FROM quiz_alunos_conectados WHERE sessao_id = ? AND status = "conectado"',
            [sessaoId]
        );
    }

    async countConnectedStudents(sessaoId: number): Promise<number> {
        const [result] = await executeQuery<any[]>(
            'SELECT COUNT(*) as total FROM quiz_alunos_conectados WHERE sessao_id = ? AND status = "conectado"',
            [sessaoId]
        );
        return result.total;
    }
} 