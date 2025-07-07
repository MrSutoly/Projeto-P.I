import { injectable } from 'tsyringe';
import { IAdminRepository } from './i_admin_repository';
import { User } from '../../../shared/util/entities/user_type';
import { 
    selectFromTable, 
    findOne, 
    insertIntoTable, 
    updateTable, 
    deleteFromTable 
} from '../../../shared/database/supabase/db';
import bcrypt from 'bcrypt';

@injectable()
export class AdminRepository implements IAdminRepository {

    async findAllUsers(): Promise<User[]> {
        return await selectFromTable<User>('usuarios');
    }

    async findUserById(id: number): Promise<User | null> {
        return await findOne<User>('usuarios', { id });
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return await findOne<User>('usuarios', { email });
    }

    async createUser(userData: Omit<User, 'id'>): Promise<User> {
        // Hash da senha
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        const userWithHashedPassword = {
            ...userData,
            password: hashedPassword,
            created_at: new Date()
        };

        const result = await insertIntoTable<User>('usuarios', userWithHashedPassword);
        return result;
    }

    async updateUser(id: number, userData: Partial<User>): Promise<User> {
        // Se há senha, fazer hash
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        const result = await updateTable<User>('usuarios', userData, { id });
        return result[0];
    }

    async deleteUser(id: number): Promise<void> {
        await deleteFromTable('usuarios', { id });
    }

    async findAllProfessors(): Promise<User[]> {
        return await selectFromTable<User>('usuarios', '*', { role: 'professor' });
    }

    async createProfessor(userData: Omit<User, 'id'>): Promise<User> {
        const professorData = {
            ...userData,
            role: 'professor' as const
        };
        return await this.createUser(professorData);
    }

    async findAllStudents(): Promise<User[]> {
        return await selectFromTable<User>('usuarios', '*', { role: 'aluno' });
    }

    async createStudent(userData: Omit<User, 'id'>): Promise<User> {
        const studentData = {
            ...userData,
            role: 'aluno' as const
        };
        return await this.createUser(studentData);
    }

    async findAllAdmins(): Promise<User[]> {
        return await selectFromTable<User>('usuarios', '*', { role: 'admin' });
    }

    async createAdmin(userData: Omit<User, 'id'>): Promise<User> {
        const adminData = {
            ...userData,
            role: 'admin' as const
        };
        return await this.createUser(adminData);
    }

    async getUserStats(): Promise<{
        total: number;
        admins: number;
        professors: number;
        students: number;
    }> {
        const allUsers = await this.findAllUsers();
        
        return {
            total: allUsers.length,
            admins: allUsers.filter(u => u.role === 'admin').length,
            professors: allUsers.filter(u => u.role === 'professor').length,
            students: allUsers.filter(u => u.role === 'aluno').length
        };
    }
} 