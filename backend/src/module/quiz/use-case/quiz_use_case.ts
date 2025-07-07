import { injectable, inject } from 'tsyringe';
import { IQuizRepository } from '../repository/i_quiz_repository';
import { Quiz, Question, Option, QuizResponse, QuizResult } from '../../../shared/util/entities/quiz_type';
import { AppError } from '../../../shared/errors/AppError';

@injectable()
export class QuizUseCase {
    constructor(
        @inject('QuizRepository')
        private quizRepository: IQuizRepository
    ) {}

    // Quiz Management
    async createQuiz(quizData: Omit<Quiz, 'id'>): Promise<Quiz> {
        // Validações
        if (!quizData.titulo || quizData.titulo.trim() === '') {
            throw new AppError('Título do quiz é obrigatório', 400);
        }

        if (!quizData.tipo || !['kahoot', 'clicar_objeto'].includes(quizData.tipo)) {
            throw new AppError('Tipo de quiz inválido', 400);
        }

        if (!quizData.pontos || quizData.pontos <= 0) {
            throw new AppError('Pontuação deve ser maior que zero', 400);
        }

        if (!quizData.perguntas || quizData.perguntas.length === 0) {
            throw new AppError('Quiz deve ter pelo menos uma pergunta', 400);
        }

        // Validar perguntas
        for (const pergunta of quizData.perguntas) {
            if (!pergunta.texto || pergunta.texto.trim() === '') {
                throw new AppError('Todas as perguntas devem ter texto', 400);
            }

            if (!pergunta.opcoes || pergunta.opcoes.length < 2) {
                throw new AppError('Cada pergunta deve ter pelo menos 2 opções', 400);
            }

            const correctOptions = pergunta.opcoes.filter(opcao => opcao.correta);
            if (correctOptions.length !== 1) {
                throw new AppError('Cada pergunta deve ter exatamente uma opção correta', 400);
            }
        }

        // Criar quiz
        const quiz = await this.quizRepository.create({
            titulo: quizData.titulo,
            tipo: quizData.tipo,
            pontos: quizData.pontos,
            atividade_id: quizData.atividade_id
        });

        // Criar perguntas e opções
        for (const perguntaData of quizData.perguntas) {
            const pergunta = await this.quizRepository.createQuestion({
                texto: perguntaData.texto,
                quiz_id: quiz.id!
            });

            if (perguntaData.opcoes) {
                for (const opcaoData of perguntaData.opcoes) {
                    await this.quizRepository.createOption({
                        texto: opcaoData.texto,
                        correta: opcaoData.correta,
                        pergunta_id: pergunta.id!
                    });
                }
            }
        }

        const fullQuiz = await this.quizRepository.findFullById(quiz.id!);
        if (!fullQuiz) {
            throw new AppError('Erro ao recuperar quiz criado', 500);
        }

        return fullQuiz;
    }

    async getQuizById(id: number): Promise<Quiz | null> {
        if (!id || isNaN(id)) {
            throw new AppError('ID inválido', 400);
        }

        return await this.quizRepository.findFullById(id);
    }

    async getAllQuizzes(): Promise<Quiz[]> {
        return await this.quizRepository.findAll();
    }

    async getQuizzesByTeacher(teacherId: number): Promise<Quiz[]> {
        if (!teacherId || isNaN(teacherId)) {
            throw new AppError('ID do professor inválido', 400);
        }

        return await this.quizRepository.findByTeacher(teacherId);
    }

    async getQuizzesByActivity(activityId: number): Promise<Quiz[]> {
        if (!activityId || isNaN(activityId)) {
            throw new AppError('ID da atividade inválido', 400);
        }

        return await this.quizRepository.findByActivity(activityId);
    }

    async updateQuiz(id: number, quizData: Partial<Quiz>): Promise<Quiz> {
        if (!id || isNaN(id)) {
            throw new AppError('ID inválido', 400);
        }

        const existingQuiz = await this.quizRepository.findById(id);
        if (!existingQuiz) {
            throw new AppError('Quiz não encontrado', 404);
        }

        // Validações
        if (quizData.titulo && quizData.titulo.trim() === '') {
            throw new AppError('Título não pode ser vazio', 400);
        }

        if (quizData.tipo && !['kahoot', 'clicar_objeto'].includes(quizData.tipo)) {
            throw new AppError('Tipo de quiz inválido', 400);
        }

        if (quizData.pontos && quizData.pontos <= 0) {
            throw new AppError('Pontuação deve ser maior que zero', 400);
        }

        const updatedQuiz = { ...existingQuiz, ...quizData, id };
        return await this.quizRepository.update(updatedQuiz);
    }

    async deleteQuiz(id: number): Promise<void> {
        if (!id || isNaN(id)) {
            throw new AppError('ID inválido', 400);
        }

        const existingQuiz = await this.quizRepository.findById(id);
        if (!existingQuiz) {
            throw new AppError('Quiz não encontrado', 404);
        }

        await this.quizRepository.delete(id);
    }

    // Quiz Response Management
    async submitResponse(userId: number, quizId: number, questionId: number, optionId: number): Promise<QuizResponse> {
        if (!userId || !quizId || !questionId || !optionId) {
            throw new AppError('Todos os campos são obrigatórios', 400);
        }

        // Verificar se o quiz existe
        const quiz = await this.quizRepository.findById(quizId);
        if (!quiz) {
            throw new AppError('Quiz não encontrado', 404);
        }

        // Verificar se a pergunta existe
        const question = await this.quizRepository.findQuestionById(questionId);
        if (!question) {
            throw new AppError('Pergunta não encontrada', 404);
        }

        // Verificar se a opção existe
        const option = await this.quizRepository.findOptionById(optionId);
        if (!option) {
            throw new AppError('Opção não encontrada', 404);
        }

        // Verificar se o usuário já respondeu esta pergunta
        const existingResponses = await this.quizRepository.findResponsesByUser(userId, quizId);
        const alreadyAnswered = existingResponses.some(response => response.question_id === questionId);

        if (alreadyAnswered) {
            throw new AppError('Usuário já respondeu esta pergunta', 400);
        }

        return await this.quizRepository.submitResponse({
            usuario_id: userId,
            quiz_id: quizId,
            question_id: questionId,
            option_id: optionId,
            timestamp: new Date()
        });
    }

    async getQuizResults(userId: number, quizId: number): Promise<QuizResult> {
        if (!userId || !quizId) {
            throw new AppError('ID do usuário e quiz são obrigatórios', 400);
        }

        return await this.quizRepository.calculateResults(userId, quizId);
    }

    async getQuizStatistics(quizId: number): Promise<{
        totalAttempts: number;
        averageScore: number;
        completionRate: number;
    }> {
        if (!quizId || isNaN(quizId)) {
            throw new AppError('ID do quiz inválido', 400);
        }

        const quiz = await this.quizRepository.findById(quizId);
        if (!quiz) {
            throw new AppError('Quiz não encontrado', 404);
        }

        return await this.quizRepository.getQuizStatistics(quizId);
    }

    // Question Management
    async addQuestion(quizId: number, questionData: Omit<Question, 'id' | 'quiz_id'>): Promise<Question> {
        if (!quizId || isNaN(quizId)) {
            throw new AppError('ID do quiz inválido', 400);
        }

        const quiz = await this.quizRepository.findById(quizId);
        if (!quiz) {
            throw new AppError('Quiz não encontrado', 404);
        }

        if (!questionData.texto || questionData.texto.trim() === '') {
            throw new AppError('Texto da pergunta é obrigatório', 400);
        }

        return await this.quizRepository.createQuestion({
            ...questionData,
            quiz_id: quizId
        });
    }

    async updateQuestion(id: number, questionData: Partial<Question>): Promise<Question> {
        if (!id || isNaN(id)) {
            throw new AppError('ID inválido', 400);
        }

        const existingQuestion = await this.quizRepository.findQuestionById(id);
        if (!existingQuestion) {
            throw new AppError('Pergunta não encontrada', 404);
        }

        if (questionData.texto && questionData.texto.trim() === '') {
            throw new AppError('Texto da pergunta não pode ser vazio', 400);
        }

        const updatedQuestion = { ...existingQuestion, ...questionData, id };
        return await this.quizRepository.updateQuestion(updatedQuestion);
    }

    async deleteQuestion(id: number): Promise<void> {
        if (!id || isNaN(id)) {
            throw new AppError('ID inválido', 400);
        }

        const existingQuestion = await this.quizRepository.findQuestionById(id);
        if (!existingQuestion) {
            throw new AppError('Pergunta não encontrada', 404);
        }

        await this.quizRepository.deleteQuestion(id);
    }

    // Option Management
    async addOption(questionId: number, optionData: Omit<Option, 'id' | 'pergunta_id'>): Promise<Option> {
        if (!questionId || isNaN(questionId)) {
            throw new AppError('ID da pergunta inválido', 400);
        }

        const question = await this.quizRepository.findQuestionById(questionId);
        if (!question) {
            throw new AppError('Pergunta não encontrada', 404);
        }

        if (!optionData.texto || optionData.texto.trim() === '') {
            throw new AppError('Texto da opção é obrigatório', 400);
        }

        return await this.quizRepository.createOption({
            ...optionData,
            pergunta_id: questionId
        });
    }

    async updateOption(id: number, optionData: Partial<Option>): Promise<Option> {
        if (!id || isNaN(id)) {
            throw new AppError('ID inválido', 400);
        }

        const existingOption = await this.quizRepository.findOptionById(id);
        if (!existingOption) {
            throw new AppError('Opção não encontrada', 404);
        }

        if (optionData.texto && optionData.texto.trim() === '') {
            throw new AppError('Texto da opção não pode ser vazio', 400);
        }

        const updatedOption = { ...existingOption, ...optionData, id };
        return await this.quizRepository.updateOption(updatedOption);
    }

    async deleteOption(id: number): Promise<void> {
        if (!id || isNaN(id)) {
            throw new AppError('ID inválido', 400);
        }

        const existingOption = await this.quizRepository.findOptionById(id);
        if (!existingOption) {
            throw new AppError('Opção não encontrada', 404);
        }

        await this.quizRepository.deleteOption(id);
    }
} 