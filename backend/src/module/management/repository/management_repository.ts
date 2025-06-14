import { injectable } from 'tsyringe';
import { executeQuery } from "../../../shared/database/mysql/db";
import { IManagementRepository } from "./i_management_repository";
import { User } from '../../../shared/util/entities/user_type';
import { Class } from '../../../shared/util/entities/class_type';
import { 
    Quiz, 
    Question, 
    Option, 
    QuizResponse, 
    QuizResult 
} from '../../../shared/util/entities/quiz_type';
import { QuizSession, AlunoResposta, Pontuacao } from '../../../shared/util/entities/quiz_type';
import { QuizMedia } from '../../../shared/util/entities/quiz_type';

@injectable() 
export class ManagementRepository implements IManagementRepository {

    async findById(id: number): Promise<User | null> {
        const [user] = await executeQuery<User[]>(
            'SELECT * FROM usuarios WHERE id = ?',
            [id]
        );
        return user || null;
    }

    async findAll(): Promise<User[]> {
        const users = await executeQuery<User[]>(
            'SELECT * FROM usuarios'
        );
        return users;
    }

    async findUserByClass(classId: number): Promise<User[]> {
        const users = await executeQuery<User[]>(
            'SELECT * FROM usuarios WHERE class_id = ?', 
            [classId]
        );
        return users;
    }

    async create(user: User): Promise<User> {
        const result = await executeQuery<{ insertId: number }>(
            'INSERT INTO usuarios (nome, email, password, role, class_id) VALUES (?, ?, ?, ?, ?)', 
            [user.nome, user.email, user.password, user.role, user.class_id]
        );
        return { ...user, id: result.insertId };
    }

    async update(user: User): Promise<User> {
        await executeQuery(
            'UPDATE usuarios SET nome = ?, email = ?, password = ?, role = ?, class_id = ? WHERE id = ?',
            [user.nome, user.email, user.password, user.role, user.class_id, user.id]
        );
        return user;
    }

    async delete(id: number): Promise<void> {
        await executeQuery(
            'DELETE FROM usuarios WHERE id = ?',
            [id]
        );
    }

    async findClassById(id: number): Promise<Class | null> {
        const [classData] = await executeQuery<Class[]>(
            'SELECT * FROM turmas WHERE id = ?', 
            [id]
        );
        return classData || null;
    }

    async findAllClasses(): Promise<Class[]> {
        const classes = await executeQuery<Class[]>(
            'SELECT * FROM turmas' 
        );
        return classes;
    }

    async createClass(classData: Class): Promise<Class> {
        const result = await executeQuery<{ insertId: number }>(
            'INSERT INTO turmas (nome, codigo) VALUES (?, ?)', 
            [classData.nome, classData.codigo]
        );
        return { ...classData, id: result.insertId };
    }

    async updateClass(classData: Class): Promise<Class> {
        await executeQuery(
            'UPDATE turmas SET nome = ?, codigo = ? WHERE id = ?',
            [classData.nome, classData.codigo, classData.id]
        );
        return classData;
    }

    async deleteClass(id: number): Promise<void> {
        await executeQuery(
            'DELETE FROM turmas WHERE id = ?',
            [id]
        );
    }

    async createQuiz(quiz: Quiz): Promise<Quiz> {
        const result = await executeQuery<{ insertId: number }>(
            'INSERT INTO quizzes (titulo, tipo, atividade_id, pontos) VALUES (?, ?, ?, ?)',
            [quiz.titulo, quiz.tipo, quiz.atividade_id, quiz.pontos]
        );
        return { ...quiz, id: result.insertId };
    }
    
    async createQuestion(question: Question): Promise<Question> {
        const result = await executeQuery<{ insertId: number }>(
            'INSERT INTO perguntas (texto, quiz_id) VALUES (?, ?)',
            [question.texto, question.quiz_id]
        );
        return { ...question, id: result.insertId };
    }
    
    async createOption(option: Option): Promise<Option> { 
        const result = await executeQuery<{ insertId: number }>(
            'INSERT INTO opcoes (texto, correta, pergunta_id) VALUES (?, ?, ?)',
            [option.texto, option.correta, option.pergunta_id]
        );
        return { ...option, id: result.insertId };
    }
    
    async findQuizById(id: number): Promise<Quiz | null> {
        const [quiz] = await executeQuery<Quiz[]>(
            'SELECT * FROM quizzes WHERE id = ?',
            [id]
        );
        return quiz || null;
    }
    
    async findAllQuizzes(): Promise<Quiz[]> {
        return await executeQuery<Quiz[]>(
            'SELECT * FROM quizzes'
        );
    }

    async findClassesByProfessor(professorId: number): Promise<Class[]> {
        return await executeQuery<Class[]>(
            'SELECT * FROM turmas WHERE professor_id = ?',
            [professorId]
        );
    }

    async addStudentToClass(userId: number, classId: number): Promise<void> {
        await executeQuery(
            'UPDATE usuarios SET class_id = ? WHERE id = ? AND role = "aluno"',
            [classId, userId]
        );
    }

    async removeStudentFromClass(userId: number, classId: number): Promise<void> {
        await executeQuery(
            'UPDATE usuarios SET class_id = NULL WHERE id = ? AND class_id = ?',
            [userId, classId]
        );
    }

    async findQuizzesByTeacher(teacherId: number): Promise<Quiz[]> {
        return await executeQuery<Quiz[]>(
            'SELECT * FROM quizzes WHERE criado_por = ?',
            [teacherId]
        );
    }

    async findFullQuizById(id: number): Promise<Quiz | null> {
        const [quiz] = await executeQuery<Quiz[]>(
            'SELECT * FROM quizzes WHERE id = ?',
            [id]
        );

        if (!quiz) return null;

        const perguntas = await executeQuery<Question[]>(
            'SELECT * FROM perguntas WHERE quiz_id = ?',
            [quiz.id]
        );

        for (const pergunta of perguntas) {
            const opcoes = await executeQuery<Option[]>(
                'SELECT * FROM opcoes WHERE pergunta_id = ?',
                [pergunta.id]
            );
            pergunta.opcoes = opcoes;
        }

        return { ...quiz, perguntas };
    }

    async updateQuiz(quiz: Quiz): Promise<Quiz> {
        await executeQuery(
            'UPDATE quizzes SET titulo = ?, tipo = ?, atividade_id = ? WHERE id = ?',
            [quiz.titulo, quiz.tipo, quiz.atividade_id, quiz.id]
        );
        return quiz;
    }

    async deleteQuiz(id: number): Promise<void> {
        await executeQuery(
            'DELETE FROM quizzes WHERE id = ?',
            [id]
        );
    }

    async findQuizzesByClass(classId: number): Promise<Quiz[]> {
        return await executeQuery<Quiz[]>(
            'SELECT * FROM quizzes WHERE atividade_id IN (SELECT id FROM atividades WHERE class_id = ?)',
            [classId]
        );
    }

    async findSessaoById(id: number): Promise<QuizSession | null> {
        const [sessao] = await executeQuery<QuizSession[]>(
            'SELECT * FROM quiz_sessions WHERE id = ?',
            [id]
        );
        return sessao || null;
    }

    async findRespostasAluno(sessaoId: number, alunoId: number): Promise<AlunoResposta[]> {
        return await executeQuery<AlunoResposta[]>(
            'SELECT * FROM quiz_respostas_alunos WHERE sessao_id = ? AND aluno_id = ?',
            [sessaoId, alunoId]
        );
    }

    async findOpcaoById(id: number): Promise<Option | null> {
        const [opcao] = await executeQuery<Option[]>(
            'SELECT * FROM opcoes WHERE id = ?',
            [id]
        );
        return opcao || null;
    }

    async findAlunosParticipantes(sessaoId: number): Promise<User[]> {
        return await executeQuery<User[]>(
            `SELECT DISTINCT u.* 
             FROM usuarios u 
             INNER JOIN quiz_respostas_alunos qra ON u.id = qra.aluno_id 
             WHERE qra.sessao_id = ? AND u.role = 'aluno'`,
            [sessaoId]
        );
    }

    async salvarPontuacao(pontuacao: Pontuacao): Promise<void> {
        await executeQuery(
            `INSERT INTO pontuacoes (pontos, aluno_id, sessao_id, turma_id) 
             VALUES (?, ?, ?, ?)`,
            [pontuacao.pontos, pontuacao.aluno_id, pontuacao.sessao_id, pontuacao.turma_id]
        );
    }

    async findPontuacoesAluno(alunoId: number): Promise<Array<{
        sessao_id: number,
        quiz_titulo: string,
        pontos: number,
        data: Date
    }>> {
        return await executeQuery(
            `SELECT p.sessao_id, q.titulo as quiz_titulo, p.pontos, qs.criado_em as data
             FROM pontuacoes p
             INNER JOIN quiz_sessions qs ON p.sessao_id = qs.id
             INNER JOIN quizzes q ON qs.quiz_id = q.id
             WHERE p.aluno_id = ?
             ORDER BY qs.criado_em DESC`,
            [alunoId]
        );
    }

    async finalizarSessao(sessaoId: number): Promise<QuizSession> {
        const [sessao] = await executeQuery<QuizSession[]>(
            `UPDATE quiz_sessions 
             SET status = 'finalizado' 
             WHERE id = ? 
             RETURNING *`,
            [sessaoId]
        );

        if (!sessao) {
            throw new Error('Erro ao finalizar sessão');
        }

        return sessao;
    }

    async atualizarMediaTurma(turmaId: number, novaMedia: number, totalQuizzes: number): Promise<QuizMedia> {
        const query = `
            INSERT INTO quiz_medias_turma (turma_id, media_geral, total_quizzes)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
                media_geral = ?,
                total_quizzes = ?,
                ultima_atualizacao = CURRENT_TIMESTAMP
        `;
        
        await executeQuery(query, [
            turmaId, novaMedia, totalQuizzes,
            novaMedia, totalQuizzes
        ]);

        return {
            turma_id: turmaId,
            media_geral: novaMedia,
            total_quizzes: totalQuizzes
        };
    }

    async obterMediaTurma(turmaId: number): Promise<QuizMedia | null> {
        const [media] = await executeQuery<QuizMedia[]>(
            'SELECT * FROM quiz_medias_turma WHERE turma_id = ?',
            [turmaId]
        );
        return media || null;
    }

    async obterTodasMediasTurmas(): Promise<QuizMedia[]> {
        return await executeQuery<QuizMedia[]>(
            'SELECT * FROM quiz_medias_turma ORDER BY media_geral DESC'
        );
    }

    async findPontuacoesSessao(sessaoId: number): Promise<Pontuacao[]> {
        return await executeQuery<Pontuacao[]>(
            'SELECT * FROM pontuacoes WHERE sessao_id = ?',
            [sessaoId]
        );
    }
}