import { injectable } from 'tsyringe';
import { 
    selectFromTable, 
    findOne, 
    insertIntoTable, 
    updateTable, 
    deleteFromTable 
} from '../../../shared/database/supabase/db';
import { IQuizRepository } from './i_quiz_repository';
import { Quiz, Question, Option, QuizResponse, QuizResult } from '../../../shared/util/entities/quiz_type';

@injectable()
export class QuizRepository implements IQuizRepository {
    
    // Quiz CRUD
    async create(quiz: Omit<Quiz, 'id'>): Promise<Quiz> {
        const result = await insertIntoTable<Quiz>('quizzes', quiz);
        return result;
    }

    async findById(id: number): Promise<Quiz | null> {
        return await findOne<Quiz>('quizzes', { id });
    }

    async findAll(): Promise<Quiz[]> {
        return await selectFromTable<Quiz>('quizzes');
    }

    async findByTeacher(teacherId: number): Promise<Quiz[]> {
        return await selectFromTable<Quiz>('quizzes', '*', { criado_por: teacherId });
    }

    async findByActivity(activityId: number): Promise<Quiz[]> {
        return await selectFromTable<Quiz>('quizzes', '*', { atividade_id: activityId });
    }

    async findFullById(id: number): Promise<Quiz | null> {
        const quiz = await findOne<Quiz>('quizzes', { id });
        
        if (!quiz) return null;

        // Buscar perguntas do quiz
        const questionsData = await selectFromTable<any>('quiz_questions', '*', { quiz_id: quiz.id });
        
        const questions: Question[] = questionsData.map((q: any) => ({
            id: q.id,
            texto: q.pergunta,
            quiz_id: q.quiz_id,
            opcoes: []
        }));
        
        // Para cada pergunta, buscar suas opções
        for (const question of questions) {
            const optionsData = await selectFromTable<any>('quiz_options', '*', { question_id: question.id });
            const options: Option[] = optionsData.map((o: any) => ({
                id: o.id,
                texto: o.opcao,
                correta: o.correta,
                pergunta_id: question.id!
            }));
            question.opcoes = options;
        }

        return { ...quiz, perguntas: questions };
    }

    async update(quiz: Quiz): Promise<Quiz> {
        const { id, ...quizData } = quiz;
        const result = await updateTable<Quiz>('quizzes', quizData, { id });
        return result[0] || quiz;
    }

    async delete(id: number): Promise<void> {
        await deleteFromTable('quizzes', { id });
    }

    // Questions CRUD
    async createQuestion(question: Omit<Question, 'id'>): Promise<Question> {
        const result = await insertIntoTable<Question>('quiz_questions', {
            quiz_id: question.quiz_id,
            pergunta: question.texto,
            tipo: 'multipla_escolha',
            ordem: 1
        });
        return { 
            id: result.id,
            texto: question.texto,
            quiz_id: question.quiz_id
        };
    }

    async findQuestionById(id: number): Promise<Question | null> {
        const questionData = await findOne<any>('quiz_questions', { id });
        if (!questionData) return null;
        
        return {
            id: questionData.id,
            texto: questionData.pergunta,
            quiz_id: questionData.quiz_id
        };
    }

    async findQuestionsByQuiz(quizId: number): Promise<Question[]> {
        const questionsData = await selectFromTable<any>('quiz_questions', '*', { quiz_id: quizId });
        return questionsData.map((q: any) => ({
            id: q.id,
            texto: q.pergunta,
            quiz_id: q.quiz_id
        }));
    }

    async updateQuestion(question: Question): Promise<Question> {
        const { id, ...questionData } = question;
        const result = await updateTable<Question>('quiz_questions', questionData, { id });
        return result[0] || question;
    }

    async deleteQuestion(id: number): Promise<void> {
        await deleteFromTable('quiz_questions', { id });
    }

    // Options CRUD
    async createOption(option: Omit<Option, 'id'>): Promise<Option> {
        const result = await insertIntoTable<Option>('quiz_options', {
            question_id: option.pergunta_id,
            opcao: option.texto,
            correta: option.correta,
            ordem: 1
        });
        return {
            id: result.id,
            texto: option.texto,
            correta: option.correta,
            pergunta_id: option.pergunta_id
        };
    }

    async findOptionById(id: number): Promise<Option | null> {
        const optionData = await findOne<any>('quiz_options', { id });
        if (!optionData) return null;
        
        return {
            id: optionData.id,
            texto: optionData.opcao,
            correta: optionData.correta,
            pergunta_id: optionData.question_id
        };
    }

    async findOptionsByQuestion(questionId: number): Promise<Option[]> {
        const optionsData = await selectFromTable<any>('quiz_options', '*', { question_id: questionId });
        return optionsData.map((o: any) => ({
            id: o.id,
            texto: o.opcao,
            correta: o.correta,
            pergunta_id: questionId
        }));
    }

    async updateOption(option: Option): Promise<Option> {
        const { id, ...optionData } = option;
        const result = await updateTable<Option>('quiz_options', optionData, { id });
        return result[0] || option;
    }

    async deleteOption(id: number): Promise<void> {
        await deleteFromTable('quiz_options', { id });
    }

    // Quiz Responses
    async submitResponse(response: Omit<QuizResponse, 'id'>): Promise<QuizResponse> {
        const result = await insertIntoTable<QuizResponse>('quiz_responses', {
            user_id: response.usuario_id,
            quiz_id: response.quiz_id,
            question_id: response.question_id,
            option_id: response.option_id,
            created_at: response.timestamp
        });
        return {
            id: result.id,
            usuario_id: response.usuario_id,
            quiz_id: response.quiz_id,
            question_id: response.question_id,
            option_id: response.option_id,
            timestamp: response.timestamp
        };
    }

    async findResponsesByUser(userId: number, quizId: number): Promise<QuizResponse[]> {
        const responses = await selectFromTable<any>('quiz_responses', '*', { 
            user_id: userId, 
            quiz_id: quizId 
        });
        return responses.map((r: any) => ({
            id: r.id,
            usuario_id: r.user_id,
            quiz_id: r.quiz_id,
            question_id: r.question_id,
            option_id: r.option_id,
            timestamp: r.created_at
        }));
    }

    async findResponsesByQuiz(quizId: number): Promise<QuizResponse[]> {
        const responses = await selectFromTable<any>('quiz_responses', '*', { quiz_id: quizId });
        return responses.map((r: any) => ({
            id: r.id,
            usuario_id: r.user_id,
            quiz_id: r.quiz_id,
            question_id: r.question_id,
            option_id: r.option_id,
            timestamp: r.created_at
        }));
    }

    async calculateResults(userId: number, quizId: number): Promise<QuizResult> {
        const responses = await this.findResponsesByUser(userId, quizId);
        const quiz = await this.findFullById(quizId);

        if (!quiz || !quiz.perguntas) {
            return {
                total_perguntas: 0,
                respostas_corretas: 0,
                pontuacao: 0,
                completude: false
            };
        }

        const totalQuestions = quiz.perguntas.length;
        let correctAnswers = 0;

        for (const response of responses) {
            if (response.option_id) {
                const option = await this.findOptionById(response.option_id);
                if (option && option.correta) {
                    correctAnswers++;
                }
            }
        }

        const pontuacao = Math.round((correctAnswers / totalQuestions) * quiz.pontos);
        const completude = responses.length === totalQuestions;

        return {
            total_perguntas: totalQuestions,
            respostas_corretas: correctAnswers,
            pontuacao,
            completude
        };
    }

    // Statistics
    async getQuizStatistics(quizId: number): Promise<{
        totalAttempts: number;
        averageScore: number;
        completionRate: number;
    }> {
        const responses = await this.findResponsesByQuiz(quizId);
        const quiz = await this.findFullById(quizId);

        if (!quiz || !quiz.perguntas) {
            return {
                totalAttempts: 0,
                averageScore: 0,
                completionRate: 0
            };
        }

        // Agrupar respostas por usuário
        const userResponses = responses.reduce((acc, response) => {
            if (!acc[response.usuario_id]) {
                acc[response.usuario_id] = [];
            }
            acc[response.usuario_id].push(response);
            return acc;
        }, {} as Record<number, QuizResponse[]>);

        const totalAttempts = Object.keys(userResponses).length;
        let totalScore = 0;
        let completedAttempts = 0;

        for (const userId in userResponses) {
            const userResponseList = userResponses[userId];
            const isCompleted = userResponseList.length === quiz.perguntas.length;
            
            if (isCompleted) {
                completedAttempts++;
                const result = await this.calculateResults(Number(userId), quizId);
                totalScore += result.pontuacao;
            }
        }

        const averageScore = completedAttempts > 0 ? totalScore / completedAttempts : 0;
        const completionRate = totalAttempts > 0 ? (completedAttempts / totalAttempts) * 100 : 0;

        return {
            totalAttempts,
            averageScore: Math.round(averageScore * 100) / 100,
            completionRate: Math.round(completionRate * 100) / 100
        };
    }
} 