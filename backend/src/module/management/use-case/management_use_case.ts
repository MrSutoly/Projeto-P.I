import { injectable, inject } from 'tsyringe';
import { IManagementRepository } from '../repository/i_management_repository';
import { User } from '../../../shared/entitie/user_type';
import { Class } from '../../../shared/entitie/class_type';
import { Quiz } from '../../../shared/entitie/quiz_type';
import { AppError } from '../../../shared/errors/AppError';
import bcrypt from 'bcrypt';

@injectable()
export class ManagementUseCase {
    constructor(
        @inject('ManagementRepository')
        private managementRepository: IManagementRepository
    ){}

    // User Management
    async findUserById(id: number): Promise<User | null> {
        if (!id) {
            throw new AppError('ID do usuário é obrigatório', 400);
        }
        return await this.managementRepository.findById(id);
    }

    async findAllUsers(): Promise<User[]> {
        return await this.managementRepository.findAll();
    }

    async findUsersByClass(classId: number): Promise<User[]> {
        if (!classId) {
            throw new AppError('ID da turma é obrigatório', 400);
        }
        return await this.managementRepository.findUserByClass(classId);
    }

    async createUser(userData: Omit<User, 'id'>): Promise<User> {
        if (!userData.nome || !userData.email || !userData.password || !userData.role) {
            throw new AppError('Todos os campos são obrigatórios', 400);
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        return await this.managementRepository.create({
            ...userData,
            password: hashedPassword
        });
    }

    async updateUser(userData: User): Promise<User> {
        if (!userData.id) {
            throw new AppError('ID do usuário é obrigatório', 400);
        }

        const existingUser = await this.managementRepository.findById(userData.id);
        if (!existingUser) {
            throw new AppError('Usuário não encontrado', 404);
        }

        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        return await this.managementRepository.update(userData);
    }

    async deleteUser(id: number): Promise<void> {
        if (!id) {
            throw new AppError('ID do usuário é obrigatório', 400);
        }

        const existingUser = await this.managementRepository.findById(id);
        if (!existingUser) {
            throw new AppError('Usuário não encontrado', 404);
        }

        await this.managementRepository.delete(id);
    }

    // Class Management
    async findClassById(id: number): Promise<Class | null> {
        if (!id) {
            throw new AppError('ID da turma é obrigatório', 400);
        }
        return await this.managementRepository.findClassById(id);
    }

    async findAllClasses(): Promise<Class[]> {
        return await this.managementRepository.findAllClasses();
    }

    async createClass(classData: Omit<Class, 'id'>): Promise<Class> {
        if (!classData.nome || !classData.codigo) {
            throw new AppError('Nome e código da turma são obrigatórios', 400);
        }

        return await this.managementRepository.createClass(classData);
    }

    async updateClass(classData: Class): Promise<Class> {
        if (!classData.id) {
            throw new AppError('ID da turma é obrigatório', 400);
        }

        const existingClass = await this.managementRepository.findClassById(classData.id);
        if (!existingClass) {
            throw new AppError('Turma não encontrada', 404);
        }

        return await this.managementRepository.updateClass(classData);
    }

    async deleteClass(id: number): Promise<void> {
        if (!id) {
            throw new AppError('ID da turma é obrigatório', 400);
        }

        const existingClass = await this.managementRepository.findClassById(id);
        if (!existingClass) {
            throw new AppError('Turma não encontrada', 404);
        }

        await this.managementRepository.deleteClass(id);
    }

    async addStudentToClass(userId: number, classId: number): Promise<void> {
        const user = await this.managementRepository.findById(userId);
        const classData = await this.managementRepository.findClassById(classId);

        if (!user) {
            throw new AppError('Usuário não encontrado', 404);
        }

        if (!classData) {
            throw new AppError('Turma não encontrada', 404);
        }

        if (user.role !== 'aluno') {
            throw new AppError('Apenas alunos podem ser adicionados à turma', 400);
        }

        await this.managementRepository.addStudentToClass(userId, classId);
    }

    async removeStudentFromClass(userId: number, classId: number): Promise<void> {
        const user = await this.managementRepository.findById(userId);
        const classData = await this.managementRepository.findClassById(classId);

        if (!user) {
            throw new AppError('Usuário não encontrado', 404);
        }

        if (!classData) {
            throw new AppError('Turma não encontrada', 404);
        }

        if (user.role !== 'aluno') {
            throw new AppError('Apenas alunos podem ser removidos da turma', 400);
        }

        await this.managementRepository.removeStudentFromClass(userId, classId);
    }

    // Quiz Management
    async createQuiz(quizData: Omit<Quiz, 'id'>): Promise<Quiz> {
    try {
        // Validação dos campos obrigatórios
        if (!quizData.titulo) {
            throw new AppError('Título do quiz é obrigatório', 400);
        }

        if (!quizData.tipo || !['kahoot', 'clicar_objeto'].includes(quizData.tipo)) {
            throw new AppError('Tipo de quiz inválido', 400);
        }

        // Validação das perguntas
        if (!quizData.perguntas || quizData.perguntas.length === 0) {
            throw new AppError('Quiz deve ter pelo menos uma pergunta', 400);
        }

        // Criar o quiz
        const quiz = await this.managementRepository.createQuiz({
            titulo: quizData.titulo,
            tipo: quizData.tipo,
            atividade_id: quizData.atividade_id
        });

        if (!quiz.id) {
            throw new AppError('Erro ao criar quiz', 500);
        }

        // Criar perguntas e opções
        for (const pergunta of quizData.perguntas) {
            // Validar pergunta
            if (!pergunta.texto) {
                throw new AppError('Texto da pergunta é obrigatório', 400);
            }

            // Validar opções
            if (!pergunta.opcoes || pergunta.opcoes.length < 2) {
                throw new AppError('Cada pergunta deve ter pelo menos 2 opções', 400);
            }

            const correctOptions = pergunta.opcoes.filter(opt => opt.correta);
            if (correctOptions.length !== 1) {
                throw new AppError('Cada pergunta deve ter exatamente uma opção correta', 400);
            }

            // Criar pergunta
            const question = await this.managementRepository.createQuestion({
                texto: pergunta.texto,
                quiz_id: quiz.id
            });

            if (!question.id) {
                throw new AppError('Erro ao criar pergunta', 500);
            }

            // Criar opções
            for (const opcao of pergunta.opcoes) {
                if (!opcao.texto) {
                    throw new AppError('Texto da opção é obrigatório', 400);
                }

                await this.managementRepository.createOption({
                    texto: opcao.texto,
                    correta: opcao.correta,
                    pergunta_id: question.id
                });
            }
        }

        // Recuperar quiz completo
        const fullQuiz = await this.managementRepository.findFullQuizById(quiz.id);
        if (!fullQuiz) {
            throw new AppError('Erro ao recuperar quiz criado', 500);
        }

        return fullQuiz;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Erro ao criar quiz', 500);
    }
}

    async findQuizById(id: number): Promise<Quiz | null> {
        try {
            if (!id || isNaN(id)) {
                throw new AppError('ID inválido', 400);
            }

            const quiz = await this.managementRepository.findFullQuizById(id);
            
            if (!quiz) {
                throw new AppError('Quiz não encontrado', 404);
            }

            return quiz;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Erro ao buscar quiz', 500);
        }
    }

    async findAllQuizzes(): Promise<Quiz[]> {
        try {
            return await this.managementRepository.findAllQuizzes();
        } catch (error) {
            throw new AppError('Erro ao listar quizzes', 500);
        }
    }

    async getTeacherClasses(professorId: number): Promise<Class[]> {
        const user = await this.managementRepository.findById(professorId);

        if (!user) {
            throw new AppError('Professor não encontrado', 404);
        }

        if (user.role !== 'professor') {
            throw new AppError('Usuário não é um professor', 403);
        }

        return await this.managementRepository.findClassesByProfessor(professorId);
    }

    async getTeacherQuizzes(professorId: number): Promise<Quiz[]> {
        const user = await this.managementRepository.findById(professorId);

        if (!user) {
            throw new AppError('Professor não encontrado', 404);
        }

        if (user.role !== 'professor') {
            throw new AppError('Usuário não é um professor', 403);
        }

        return await this.managementRepository.findQuizzesByTeacher(professorId);
    }

    async findQuizzesByClass(classId: number): Promise<Quiz[]> {
        try {
            if (!classId || isNaN(classId)) {
                throw new AppError('ID da turma inválido', 400);
            }

            const classExists = await this.managementRepository.findClassById(classId);
            if (!classExists) {
                throw new AppError('Turma não encontrada', 404);
            }

            return await this.managementRepository.findQuizzesByClass(classId);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Erro ao buscar quizzes da turma', 500);
        }
    }
}