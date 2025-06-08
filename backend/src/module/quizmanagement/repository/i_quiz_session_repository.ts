import { QuizSession, QuizRespostaAluno, QuizAlunoConectado } from '../types/quiz_session_type';

export interface IQuizSessionRepository {
    // Sessões
    createSession(session: QuizSession): Promise<QuizSession>;
    getSessionById(id: number): Promise<QuizSession | null>;
    getSessionByCode(codigo: string): Promise<QuizSession | null>;
    updateSessionStatus(id: number, status: QuizSession['status']): Promise<void>;
    updateCurrentQuestion(id: number, perguntaAtual: number): Promise<void>;
    finalizeSession(id: number): Promise<void>;

    // Respostas dos alunos
    saveStudentAnswer(answer: QuizRespostaAluno): Promise<QuizRespostaAluno>;
    getStudentAnswers(sessaoId: number, perguntaId: number): Promise<QuizRespostaAluno[]>;
    countStudentAnswers(sessaoId: number, perguntaId: number): Promise<number>;

    // Alunos conectados
    connectStudent(connection: QuizAlunoConectado): Promise<QuizAlunoConectado>;
    disconnectStudent(sessaoId: number, alunoId: number): Promise<void>;
    getConnectedStudents(sessaoId: number): Promise<QuizAlunoConectado[]>;
    countConnectedStudents(sessaoId: number): Promise<number>;
} 