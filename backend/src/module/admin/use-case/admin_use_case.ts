import { injectable, inject } from 'tsyringe';
import { IAdminRepository } from '../repository/i_admin_repository';
import { User } from '../../../shared/util/entities/user_type';

@injectable()
export class AdminUseCase {
    constructor(
        @inject('AdminRepository')
        private adminRepository: IAdminRepository
    ) {}

    async getAllUsers(): Promise<User[]> {
        return await this.adminRepository.findAllUsers();
    }

    async getUserById(id: number): Promise<User | null> {
        return await this.adminRepository.findUserById(id);
    }

    async createProfessor(professorData: {
        nome: string;
        email: string;
        password: string;
    }): Promise<User> {
        // Validações
        if (!professorData.nome || !professorData.email || !professorData.password) {
            throw new Error('Todos os campos são obrigatórios');
        }

        // Verificar se email já existe
        const existingUser = await this.adminRepository.findUserByEmail(professorData.email);
        if (existingUser) {
            throw new Error('Este email já está em uso');
        }

        // Validação de email básica
        if (!professorData.email.includes('@')) {
            throw new Error('Email inválido');
        }

        return await this.adminRepository.createProfessor({
            ...professorData,
            role: 'professor'
        });
    }

    async createStudent(studentData: {
        nome: string;
        email: string;
        password: string;
        turma_id?: number;
    }): Promise<User> {
        // Validações
        if (!studentData.nome || !studentData.email || !studentData.password) {
            throw new Error('Todos os campos são obrigatórios');
        }

        // Verificar se email já existe
        const existingUser = await this.adminRepository.findUserByEmail(studentData.email);
        if (existingUser) {
            throw new Error('Este email já está em uso');
        }

        // Validação de email básica
        if (!studentData.email.includes('@')) {
            throw new Error('Email inválido');
        }

        return await this.adminRepository.createStudent({
            ...studentData,
            role: 'aluno'
        });
    }

    async createAdmin(adminData: {
        nome: string;
        email: string;
        password: string;
    }): Promise<User> {
        // Validações
        if (!adminData.nome || !adminData.email || !adminData.password) {
            throw new Error('Todos os campos são obrigatórios');
        }

        // Verificar se email já existe
        const existingUser = await this.adminRepository.findUserByEmail(adminData.email);
        if (existingUser) {
            throw new Error('Este email já está em uso');
        }

        // Validação de email básica
        if (!adminData.email.includes('@')) {
            throw new Error('Email inválido');
        }

        return await this.adminRepository.createAdmin({
            ...adminData,
            role: 'admin'
        });
    }

    async getAllProfessors(): Promise<User[]> {
        return await this.adminRepository.findAllProfessors();
    }

    async getAllStudents(): Promise<User[]> {
        return await this.adminRepository.findAllStudents();
    }

    async getAllAdmins(): Promise<User[]> {
        return await this.adminRepository.findAllAdmins();
    }

    async updateUser(id: number, userData: Partial<User>): Promise<User> {
        const existingUser = await this.adminRepository.findUserById(id);
        if (!existingUser) {
            throw new Error('Usuário não encontrado');
        }

        // Se está alterando email, verificar se não está em uso
        if (userData.email && userData.email !== existingUser.email) {
            const emailInUse = await this.adminRepository.findUserByEmail(userData.email);
            if (emailInUse) {
                throw new Error('Este email já está em uso');
            }
        }

        return await this.adminRepository.updateUser(id, userData);
    }

    async deleteUser(id: number): Promise<void> {
        const existingUser = await this.adminRepository.findUserById(id);
        if (!existingUser) {
            throw new Error('Usuário não encontrado');
        }

        await this.adminRepository.deleteUser(id);
    }

    async getUserStats(): Promise<{
        total: number;
        admins: number;
        professors: number;
        students: number;
    }> {
        return await this.adminRepository.getUserStats();
    }

    async createInitialAdmin(): Promise<User> {
        // Verificar se já existe algum admin
        const existingAdmins = await this.adminRepository.findAllAdmins();
        
        if (existingAdmins.length > 0) {
            throw new Error('Já existe um administrador no sistema');
        }

        const adminData = {
            nome: 'Administrador Principal',
            email: 'admin@doutoresambientais.com',
            password: 'admin123',
            role: 'admin' as const
        };

        return await this.adminRepository.createAdmin(adminData);
    }
} 