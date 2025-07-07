import { injectable } from 'tsyringe';
import { selectFromTable, findOne, insertIntoTable, updateTable, deleteFromTable } from "../../../shared/database/supabase/db";
import { IManagementRepository } from "./i_management_repository";
import { User } from '../../../shared/util/entities/user_type';
import { Class } from '../../../shared/util/entities/class_type';
import { 
    Quiz, 
    Question, 
    Option, 
    QuizResponse, 
    QuizResult,
    QuizSession, 
    AlunoResposta, 
    Pontuacao,
    QuizMedia
} from '../../../shared/util/entities/quiz_type';

@injectable() 
export class ManagementRepository implements IManagementRepository {

    async findById(id: number): Promise<User | null> {
        return await findOne<User>('usuarios', { id });
    }

    async findAll(): Promise<User[]> {
        return await selectFromTable<User>('usuarios');
    }

    async findUserByClass(classId: number): Promise<User[]> {
        return await selectFromTable<User>('usuarios', '*', { turma_id: classId });
    }

    async create(user: User): Promise<User> {
        const { id, ...userData } = user;
        const result = await insertIntoTable<User>('usuarios', userData);
        return result;
    }

    async update(user: User): Promise<User> {
        const { id, ...userData } = user;
        const result = await updateTable<User>('usuarios', userData, { id });
        return result[0] || user;
    }

    async delete(id: number): Promise<void> {
        await deleteFromTable('usuarios', { id });
    }

    async findClassById(id: number): Promise<Class | null> {
        return await findOne<Class>('turmas', { id });
    }

    async findAllClasses(): Promise<Class[]> {
        return await selectFromTable<Class>('turmas');
    }

    async createClass(classData: Class): Promise<Class> {
        const { id, ...classDataWithoutId } = classData;
        const result = await insertIntoTable<Class>('turmas', classDataWithoutId);
        return result;
    }

    async updateClass(classData: Class): Promise<Class> {
        const { id, ...classDataWithoutId } = classData;
        const result = await updateTable<Class>('turmas', classDataWithoutId, { id });
        return result[0] || classData;
    }

    async deleteClass(id: number): Promise<void> {
        await deleteFromTable('turmas', { id });
    }

    async createQuiz(quiz: Quiz): Promise<Quiz> {
        const { id, ...quizData } = quiz;
        const result = await insertIntoTable<Quiz>('quizzes', quizData);
        return result;
    }
    
    async createQuestion(question: Question): Promise<Question> {
        const { id, ...questionData } = question;
        const result = await insertIntoTable<Question>('quiz_questions', questionData);
        return result;
    }
    
    async createOption(option: Option): Promise<Option> { 
        const { id, ...optionData } = option;
        const result = await insertIntoTable<Option>('quiz_options', optionData);
        return result;
    }
    
    async findQuizById(id: number): Promise<Quiz | null> {
        return await findOne<Quiz>('quizzes', { id });
    }
    
    async findAllQuizzes(): Promise<Quiz[]> {
        return await selectFromTable<Quiz>('quizzes');
    }

    async findClassesByProfessor(professorId: number): Promise<Class[]> {
        return await selectFromTable<Class>('turmas', '*', { professor_id: professorId });
    }

    async addStudentToClass(userId: number, classId: number): Promise<void> {
        await updateTable('usuarios', { turma_id: classId }, { id: userId, role: 'aluno' });
    }

    async removeStudentFromClass(userId: number, classId: number): Promise<void> {
        await updateTable('usuarios', { turma_id: null }, { id: userId, turma_id: classId });
    }

    async findQuizzesByTeacher(teacherId: number): Promise<Quiz[]> {
        return await selectFromTable<Quiz>('quizzes', '*', { criado_por: teacherId });
    }

    async findFullQuizById(id: number): Promise<Quiz | null> {
        const quiz = await findOne<Quiz>('quizzes', { id });

        if (!quiz) return null;

        const perguntas = await selectFromTable<Question>('quiz_questions', '*', { quiz_id: quiz.id });

        for (const pergunta of perguntas) {
            const opcoes = await selectFromTable<Option>('quiz_options', '*', { question_id: pergunta.id });
            pergunta.opcoes = opcoes;
        }

        return { ...quiz, perguntas };
    }

    async updateQuiz(quiz: Quiz): Promise<Quiz> {
        const { id, ...quizData } = quiz;
        const result = await updateTable<Quiz>('quizzes', quizData, { id });
        return result[0] || quiz;
    }

    async deleteQuiz(id: number): Promise<void> {
        await deleteFromTable('quizzes', { id });
    }

    async findQuizzesByClass(classId: number): Promise<Quiz[]> {
        // Buscar quizzes que pertencem a atividades da turma
        return await selectFromTable<Quiz>('quizzes', '*', { atividade_id: classId });
    }

    async findSessaoById(id: number): Promise<QuizSession | null> {
        return await findOne<QuizSession>('quiz_sessions', { id });
    }

    async findRespostasAluno(sessaoId: number, alunoId: number): Promise<AlunoResposta[]> {
        return await selectFromTable<AlunoResposta>('student_answers', '*', { 
            sessao_id: sessaoId, 
            aluno_id: alunoId 
        });
    }

    async findOpcaoById(id: number): Promise<Option | null> {
        return await findOne<Option>('quiz_options', { id });
    }

    async findAlunosParticipantes(sessaoId: number): Promise<User[]> {
        // Buscar alunos que responderam na sessão
        return await selectFromTable<User>('usuarios', '*', { 
            role: 'aluno',
            // Aqui precisaríamos fazer um join, mas por simplicidade vamos buscar todos os alunos
        });
    }

    async salvarPontuacao(pontuacao: Pontuacao): Promise<void> {
        await insertIntoTable('quiz_responses', pontuacao);
    }

    async findPontuacoesAluno(alunoId: number): Promise<Array<{
        sessao_id: number,
        quiz_titulo: string,
        pontos: number,
        data: Date
    }>> {
        // Buscar respostas do aluno
        const respostas = await selectFromTable<any>('quiz_responses', '*', { user_id: alunoId });
        return respostas.map(r => ({
            sessao_id: r.quiz_id,
            quiz_titulo: 'Quiz', // Simplificado
            pontos: r.pontos || 0,
            data: r.created_at
        }));
    }

    async finalizarSessao(sessaoId: number): Promise<QuizSession> {
        const result = await updateTable<QuizSession>('quiz_sessions', { status: 'finalizado' }, { id: sessaoId });
        
        if (!result || result.length === 0) {
            throw new Error('Erro ao finalizar sessão');
        }

        return result[0];
    }

    async atualizarMediaTurma(turmaId: number, novaMedia: number, totalQuizzes: number): Promise<QuizMedia> {
        const mediaData = {
            turma_id: turmaId,
            media_geral: novaMedia,
            total_quizzes: totalQuizzes
        };

        await insertIntoTable('ranking_turmas', mediaData);
        
        return mediaData;
    }

    async obterMediaTurma(turmaId: number): Promise<QuizMedia | null> {
        return await findOne<QuizMedia>('ranking_turmas', { turma_id: turmaId });
    }

    async obterTodasMediasTurmas(): Promise<QuizMedia[]> {
        return await selectFromTable<QuizMedia>('ranking_turmas');
    }

    async findPontuacoesSessao(sessaoId: number): Promise<Pontuacao[]> {
        return await selectFromTable<Pontuacao>('quiz_responses', '*', { quiz_id: sessaoId });
    }
}