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
                'INSERT INTO quizzes (titulo, tipo, atividade_id) VALUES (?, ?, ?)',
                [quiz.titulo, quiz.tipo, quiz.atividade_id]
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
}