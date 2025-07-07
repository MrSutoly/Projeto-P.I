import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AdminUseCase } from '../../use-case/admin_use_case';

export class AdminController {
    private adminUseCase: AdminUseCase;

    constructor() {
        this.adminUseCase = container.resolve<AdminUseCase>('AdminUseCase');
    }

    // Dashboard - Estatísticas gerais
    async getDashboard(req: Request, res: Response): Promise<Response> {
        try {
            const stats = await this.adminUseCase.getUserStats();
            return res.status(200).json(stats);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Listar todos os usuários
    async getAllUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users = await this.adminUseCase.getAllUsers();
            // Remover senhas da resposta
            const sanitizedUsers = users.map(user => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
            return res.status(200).json(sanitizedUsers);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Listar professores
    async getAllProfessors(req: Request, res: Response): Promise<Response> {
        try {
            const professors = await this.adminUseCase.getAllProfessors();
            const sanitizedProfessors = professors.map(user => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
            return res.status(200).json(sanitizedProfessors);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Listar alunos
    async getAllStudents(req: Request, res: Response): Promise<Response> {
        try {
            const students = await this.adminUseCase.getAllStudents();
            const sanitizedStudents = students.map(user => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
            return res.status(200).json(sanitizedStudents);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Listar administradores
    async getAllAdmins(req: Request, res: Response): Promise<Response> {
        try {
            const admins = await this.adminUseCase.getAllAdmins();
            const sanitizedAdmins = admins.map(user => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
            return res.status(200).json(sanitizedAdmins);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Criar professor
    async createProfessor(req: Request, res: Response): Promise<Response> {
        try {
            const { nome, email, password } = req.body;
            const professor = await this.adminUseCase.createProfessor({ nome, email, password });
            
            // Remover senha da resposta
            const { password: _, ...professorWithoutPassword } = professor;
            return res.status(201).json({
                message: 'Professor criado com sucesso',
                professor: professorWithoutPassword
            });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Criar aluno
    async createStudent(req: Request, res: Response): Promise<Response> {
        try {
            const { nome, email, password, turma_id } = req.body;
            const student = await this.adminUseCase.createStudent({ nome, email, password, turma_id });
            
            // Remover senha da resposta
            const { password: _, ...studentWithoutPassword } = student;
            return res.status(201).json({
                message: 'Aluno criado com sucesso',
                student: studentWithoutPassword
            });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Criar administrador
    async createAdmin(req: Request, res: Response): Promise<Response> {
        try {
            const { nome, email, password } = req.body;
            const admin = await this.adminUseCase.createAdmin({ nome, email, password });
            
            // Remover senha da resposta
            const { password: _, ...adminWithoutPassword } = admin;
            return res.status(201).json({
                message: 'Administrador criado com sucesso',
                admin: adminWithoutPassword
            });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Obter usuário por ID
    async getUserById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const user = await this.adminUseCase.getUserById(Number(id));
            
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            // Remover senha da resposta
            const { password, ...userWithoutPassword } = user;
            return res.status(200).json(userWithoutPassword);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Atualizar usuário
    async updateUser(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const userData = req.body;
            
            const updatedUser = await this.adminUseCase.updateUser(Number(id), userData);
            
            // Remover senha da resposta
            const { password, ...userWithoutPassword } = updatedUser;
            return res.status(200).json({
                message: 'Usuário atualizado com sucesso',
                user: userWithoutPassword
            });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Deletar usuário
    async deleteUser(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            await this.adminUseCase.deleteUser(Number(id));
            
            return res.status(200).json({ message: 'Usuário deletado com sucesso' });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Criar administrador inicial
    async createInitialAdmin(req: Request, res: Response): Promise<Response> {
        try {
            const admin = await this.adminUseCase.createInitialAdmin();
            
            // Remover senha da resposta
            const { password, ...adminWithoutPassword } = admin;
            return res.status(201).json({
                message: 'Administrador inicial criado com sucesso',
                admin: adminWithoutPassword,
                credentials: {
                    email: 'admin@doutoresambientais.com',
                    password: 'admin123'
                }
            });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }
} 