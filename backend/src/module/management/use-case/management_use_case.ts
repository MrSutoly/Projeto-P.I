import { injectable, inject } from 'tsyringe';
import { IManagementRepository } from '../repository/i_management_repository';
import { User } from '../../../shared//entitie/user_type';
import { Class } from '../../../shared/entitie/class_type';
import bcrypt from 'bcrypt';

@injectable()
export class ManagementUseCase {
    constructor(
        @inject('ManagementRepository')
        private managementRepository: IManagementRepository
    ){}

    // User 
    async findUserById(id: number): Promise<User | null> {
        if (!id) {
            throw new Error('ID do usuário é obrigatório');
        }
        return await this.managementRepository.findById(id);
    }

    async findAllUsers(): Promise<User[]> {
        return await this.managementRepository.findAll();
    }

    async findUsersByClass(classId: number): Promise<User[]> {
        if (!classId) {
            throw new Error('ID da turma é obrigatório');
        }
        return await this.managementRepository.findUserByClass(classId);
    }

    async createUser(userData: Omit<User, 'id'>): Promise<User> {
        if (!userData.nome || !userData.email || !userData.password || !userData.role) {
            throw new Error('Todos os campos são obrigatórios');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        return await this.managementRepository.create({
            ...userData,
            password: hashedPassword
        });
    }

    async updateUser(userData: User): Promise<User> {
        if (!userData.id) {
            throw new Error('ID do usuário é obrigatório');
        }

        const existingUser = await this.managementRepository.findById(userData.id);
        if (!existingUser) {
            throw new Error('Usuário não encontrado');
        }

        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        return await this.managementRepository.update(userData);
    }

    async deleteUser(id: number): Promise<void> {
        if (!id) {
            throw new Error('ID do usuário é obrigatório');
        }

        const existingUser = await this.managementRepository.findById(id);
        if (!existingUser) {
            throw new Error('Usuário não encontrado');
        }

        await this.managementRepository.delete(id);
    }

    // Class
    async findClassById(id: number): Promise<Class | null> {
        if (!id) {
            throw new Error('ID da turma é obrigatório');
        }
        return await this.managementRepository.findClassById(id);
    }

    async findAllClasses(): Promise<Class[]> {
        return await this.managementRepository.findAllClasses();
    }

    async createClass(classData: Omit<Class, 'id'>): Promise<Class> {
        if (!classData.nome || !classData.codigo) {
            throw new Error('Nome e código da turma são obrigatórios');
        }

        return await this.managementRepository.createClass(classData);
    }

    async updateClass(classData: Class): Promise<Class> {
        if (!classData.id) {
            throw new Error('ID da turma é obrigatório');
        }

        const existingClass = await this.managementRepository.findClassById(classData.id);
        if (!existingClass) {
            throw new Error('Turma não encontrada');
        }

        return await this.managementRepository.updateClass(classData);
    }

    async deleteClass(id: number): Promise<void> {
        if (!id) {
            throw new Error('ID da turma é obrigatório');
        }

        const existingClass = await this.managementRepository.findClassById(id);
        if (!existingClass) {
            throw new Error('Turma não encontrada');
        }

        await this.managementRepository.deleteClass(id);
    }
}