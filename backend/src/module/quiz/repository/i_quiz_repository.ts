import { Quiz, Question, Option, QuizResponse, QuizResult } from '../../../shared/util/entities/quiz_type';

export interface IQuizRepository {
    // Quiz CRUD
    create(quiz: Omit<Quiz, 'id'>): Promise<Quiz>;
    findById(id: number): Promise<Quiz | null>;
    findAll(): Promise<Quiz[]>;
    findByTeacher(teacherId: number): Promise<Quiz[]>;
    findByActivity(activityId: number): Promise<Quiz[]>;
    findFullById(id: number): Promise<Quiz | null>;
    update(quiz: Quiz): Promise<Quiz>;
    delete(id: number): Promise<void>;

    // Questions CRUD
    createQuestion(question: Omit<Question, 'id'>): Promise<Question>;
    findQuestionById(id: number): Promise<Question | null>;
    findQuestionsByQuiz(quizId: number): Promise<Question[]>;
    updateQuestion(question: Question): Promise<Question>;
    deleteQuestion(id: number): Promise<void>;

    // Options CRUD
    createOption(option: Omit<Option, 'id'>): Promise<Option>;
    findOptionById(id: number): Promise<Option | null>;
    findOptionsByQuestion(questionId: number): Promise<Option[]>;
    updateOption(option: Option): Promise<Option>;
    deleteOption(id: number): Promise<void>;

    // Quiz Responses
    submitResponse(response: Omit<QuizResponse, 'id'>): Promise<QuizResponse>;
    findResponsesByUser(userId: number, quizId: number): Promise<QuizResponse[]>;
    findResponsesByQuiz(quizId: number): Promise<QuizResponse[]>;
    calculateResults(userId: number, quizId: number): Promise<QuizResult>;

    // Statistics
    getQuizStatistics(quizId: number): Promise<{
        totalAttempts: number;
        averageScore: number;
        completionRate: number;
    }>;
} 