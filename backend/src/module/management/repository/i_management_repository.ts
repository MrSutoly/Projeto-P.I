import { User } from '../../../shared/util/entities/user_type';
import { Class } from '../../../shared/util/entities/class_type';
import { Quiz, Question, Option } from '../../../shared/util/entities/quiz_type';

// Interfaces para pontuação
interface QuizSession {
    id: number;
    quiz_id: number;
    professor_id: number;
    turma_id: number;
    status: 'aguardando' | 'em_andamento' | 'finalizado';
    pergunta_atual: number;
    codigo_acesso: string;
    criado_em: Date;
}

interface AlunoResposta {
    id: number;
    sessao_id: number;
    aluno_id: number;
    pergunta_id: number;
    resposta_id: number;
    tempo_resposta: number;
    respondido_em: Date;
}

interface Pontuacao {
    pontos: number;
    aluno_id: number;
    sessao_id: number;
    turma_id: number;
}

export interface IManagementRepository {
    // User Management
    findById(id: number): Promise<User | null>;
    findAll(): Promise<User[]>;
    findUserByClass(ClassId: number): Promise<User[]>;
    create(user: User): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: number): Promise<void>;

    // Class Management
    findClassById(id: number): Promise<Class | null>;
    findAllClasses(): Promise<Class[]>;
    findClassesByProfessor(professorId: number): Promise<Class[]>;
    createClass(classData: Class): Promise<Class>;
    updateClass(classData: Class): Promise<Class>;
    deleteClass(id: number): Promise<void>;
    addStudentToClass(userId: number, classId: number): Promise<void>;
    removeStudentFromClass(userId: number, classId: number): Promise<void>;

    // Quiz Management
    createQuiz(quiz: Quiz): Promise<Quiz>;
    createQuestion(question: Question): Promise<Question>;
    createOption(option: Option): Promise<Option>;
    findQuizById(id: number): Promise<Quiz | null>;
    findAllQuizzes(): Promise<Quiz[]>;
    findQuizzesByTeacher(teacherId: number): Promise<Quiz[]>;
    findQuizzesByClass(classId: number): Promise<Quiz[]>;
    findFullQuizById(id: number): Promise<Quiz | null>;
    updateQuiz(quiz: Quiz): Promise<Quiz>;
    deleteQuiz(id: number): Promise<void>;

    // Quiz Session Management
    findSessaoById(id: number): Promise<QuizSession | null>;
    findRespostasAluno(sessaoId: number, alunoId: number): Promise<AlunoResposta[]>;
    findOpcaoById(id: number): Promise<Option | null>;
    findAlunosParticipantes(sessaoId: number): Promise<User[]>;
    salvarPontuacao(pontuacao: Pontuacao): Promise<void>;
    finalizarSessao(sessaoId: number): Promise<QuizSession>;
}