import { Quiz, Question, Option } from '../../../shared/entitie/quiz_type';

export interface IQuizRepository {
    createQuiz(quiz: Quiz): Promise<Quiz>;
    createQuestion(question: Question): Promise<Question>;
    createOption(option: Option): Promise<Option>;
    findQuizById(id: number): Promise<Quiz | null>;
    findAllQuizzes(): Promise<Quiz[]>;
    findFullQuizById(id: number): Promise<Quiz | null>;
}