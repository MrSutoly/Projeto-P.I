import { QuizSession, ConnectedStudent, StudentAnswer } from '../type/quizsession_type';

export interface IQuizSessionRepository {
    createSession(session: QuizSession): Promise<QuizSession>;
    findSessionByCode(code: string): Promise<QuizSession | null>;
    connectStudent(sessao_id: number, aluno_id: number): Promise<void>;
    getConnectedStudents(sessao_id: number): Promise<ConnectedStudent[]>;
    startSession(sessao_id: number): Promise<void>;
    setCurrentQuestion(sessao_id: number, pergunta_atual: number): Promise<void>;
    submitAnswer(answer: StudentAnswer): Promise<void>;
    getAnswersForQuestion(sessao_id: number, pergunta_id: number): Promise<StudentAnswer[]>;
    finishSession(sessao_id: number): Promise<void>;
}