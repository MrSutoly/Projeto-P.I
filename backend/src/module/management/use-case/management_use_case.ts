import { injectable, inject } from 'tsyringe';
import { IManagementRepository } from '../repository/i_management_repository';
import { User } from '../../../shared/util/entities/user_type';
import { Class } from '../../../shared/util/entities/class_type';
import { Quiz, QuizSession } from '../../../shared/util/entities/quiz_type';
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

        if (!quizData.pontos || quizData.pontos <= 0) {
            throw new AppError('A quantidade de pontos é obrigatória e deve ser maior que zero', 400);
        }

        // Validação das perguntas
        if (!quizData.perguntas || quizData.perguntas.length === 0) {
            throw new AppError('Quiz deve ter pelo menos uma pergunta', 400);
        }

        // Criar o quiz
        const quiz = await this.managementRepository.createQuiz({
            titulo: quizData.titulo,
            tipo: quizData.tipo,
            atividade_id: quizData.atividade_id,
            pontos: quizData.pontos
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

    async deleteQuiz(id: number): Promise<void> {
        if (!id) {
            throw new AppError('ID do quiz é obrigatório', 400);
        }
        await this.managementRepository.deleteQuiz(id);
    }

    // Métodos para gerenciamento de pontuações
    async calcularMediaTurma(sessaoId: number): Promise<{ media: number, totalAlunos: number }> {
        try {
            const sessao = await this.managementRepository.findSessaoById(sessaoId);
            if (!sessao) {
                throw new AppError('Sessão não encontrada', 404);
            }

            // Buscar todos os alunos da turma que participaram da sessão
            const alunos = await this.managementRepository.findAlunosParticipantes(sessaoId);
            if (!alunos || alunos.length === 0) {
                throw new AppError('Nenhum aluno participou desta sessão', 404);
            }

            let somaPontos = 0;
            for (const aluno of alunos) {
                if (aluno.id) { // Verifica se o ID existe
                    const pontos = await this.calcularPontuacaoAluno(sessaoId, aluno.id);
                    somaPontos += pontos;
                }
            }

            const media = somaPontos / alunos.length;

            return {
                media: Number(media.toFixed(2)),
                totalAlunos: alunos.length
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Erro ao calcular média da turma', 500);
        }
    }

    async calcularPontuacaoAluno(sessaoId: number, alunoId: number): Promise<number> {
        try {
            // Buscar todas as respostas do aluno na sessão
            const respostas = await this.managementRepository.findRespostasAluno(sessaoId, alunoId);
            if (!respostas || respostas.length === 0) {
                throw new AppError('Nenhuma resposta encontrada para este aluno nesta sessão', 404);
            }

            // Buscar informações do quiz
            const sessao = await this.managementRepository.findSessaoById(sessaoId);
            if (!sessao) {
                throw new AppError('Sessão não encontrada', 404);
            }

            const quiz = await this.managementRepository.findQuizById(sessao.quiz_id);
            if (!quiz) {
                throw new AppError('Quiz não encontrado', 404);
            }

            // Calcular pontos
            let pontosTotais = 0;
            for (const resposta of respostas) {
                const opcao = await this.managementRepository.findOpcaoById(resposta.resposta_id);
                if (opcao && opcao.correta) {
                    pontosTotais += quiz.pontos / respostas.length; // Distribui os pontos igualmente entre as perguntas
                }
            }

            // Salvar pontuação
            await this.managementRepository.salvarPontuacao({
                pontos: pontosTotais,
                aluno_id: alunoId,
                sessao_id: sessaoId,
                turma_id: sessao.turma_id
            });

            return pontosTotais;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Erro ao calcular pontuação do aluno', 500);
        }
    }

    private async atualizarMediaTurma(turmaId: number, novaMedia: number): Promise<void> {
        const mediaAtual = await this.managementRepository.obterMediaTurma(turmaId);
        
        if (mediaAtual) {
            // Soma todas as médias e divide pelo total de quizzes
            const somaMedias = (mediaAtual.media_geral * mediaAtual.total_quizzes) + novaMedia;
            const novaMediaGeral = somaMedias / (mediaAtual.total_quizzes + 1);
            
            await this.managementRepository.atualizarMediaTurma(
                turmaId,
                novaMediaGeral,
                mediaAtual.total_quizzes + 1
            );
        } else {
            // Primeiro quiz da turma
            await this.managementRepository.atualizarMediaTurma(
                turmaId,
                novaMedia, // A média do primeiro quiz é a média geral
                1
            );
        }
    }

    async finalizarSessaoQuiz(sessaoId: number): Promise<{
        sessao: QuizSession;
        mediaTurma: number;
        totalAlunos: number;
        status: 'finalizado';
    }> {
        try {
            // Verificar se a sessão existe
            const sessao = await this.managementRepository.findSessaoById(sessaoId);
            if (!sessao) {
                throw new AppError('Sessão não encontrada', 404);
            }

            // Verificar se a sessão já não está finalizada
            if (sessao.status === 'finalizado') {
                throw new AppError('Esta sessão já foi finalizada', 400);
            }

            // Calcular média da turma
            const { media, totalAlunos } = await this.calcularMediaTurma(sessaoId);
            
            // Atualizar média geral da turma
            await this.atualizarMediaTurma(sessao.turma_id, media);

            // Finalizar a sessão
            const sessaoFinalizada = await this.managementRepository.finalizarSessao(sessaoId);

            return {
                sessao: sessaoFinalizada,
                mediaTurma: media,
                totalAlunos,
                status: 'finalizado'
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Erro ao finalizar sessão do quiz', 500);
        }
    }
}