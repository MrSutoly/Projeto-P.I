import { Quiz, Question, Option } from '../../../shared/entitie/quiz_type';

export interface IQuizRepository {
    createQuiz(quiz: Quiz): Promise<Quiz>;
    createQuestion(question: Question): Promise<Question>;
    createOption(option: Option): Promise<Option>;
    findQuizById(id: number): Promise<Quiz | null>;
    findAllQuizzes(): Promise<Quiz[]>;
    findFullQuizById(id: number): Promise<Quiz | null>;

    submitQuizResponse(response: QuizResponse): Promise<QuizResponse>;
    getQuizResults(quizId: number, userId: number): Promise<QuizResult>;
    checkAnswer(optionId: number): Promise<boolean>;
    savePontuacao(pontuacao: {
        pontos: number;
        completude: boolean;
        class_id: number;
        resposta_id: number;
    }): Promise<void>;
    
}