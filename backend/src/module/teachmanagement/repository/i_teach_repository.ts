import { Activity, Week, Quiz, Question, Option } from '../types/activity_type';

export interface ITeachRepository {
   
    createActivity(activity: Activity): Promise<Activity>;
    getAllActivities(): Promise<Activity[]>;
    getActivityById(id: number): Promise<Activity | null>;
    updateActivity(id: number, activity: Partial<Activity>): Promise<Activity>;
    deleteActivity(id: number): Promise<void>;

   
    createWeek(week: Week): Promise<Week>;
    getAllWeeks(): Promise<Week[]>;
    getWeekByNumber(numero: number): Promise<Week | null>;
    updateWeek(numero: number, week: Partial<Week>): Promise<Week>;
    deleteWeek(numero: number): Promise<void>;

    
    createQuiz(quiz: Quiz): Promise<Quiz>;
    getAllQuizzes(): Promise<Quiz[]>;
    getQuizById(id: number): Promise<Quiz | null>;
    updateQuiz(id: number, quiz: Partial<Quiz>): Promise<Quiz>;
    deleteQuiz(id: number): Promise<void>;

    
    createQuestion(question: Question): Promise<Question>;
    getQuestionsByQuizId(quizId: number): Promise<Question[]>;
    updateQuestion(id: number, question: Partial<Question>): Promise<Question>;
    deleteQuestion(id: number): Promise<void>;

    createOption(option: Option): Promise<Option>;
    getOptionsByQuestionId(questionId: number): Promise<Option[]>;
    updateOption(id: number, option: Partial<Option>): Promise<Option>;
    deleteOption(id: number): Promise<void>;
} 