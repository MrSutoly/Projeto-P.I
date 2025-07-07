import { User } from '../../../shared/util/entities/user_type';

export interface IAdminRepository {
    // Gestão de usuários
    findAllUsers(): Promise<User[]>;
    findUserById(id: number): Promise<User | null>;
    findUserByEmail(email: string): Promise<User | null>;
    createUser(userData: Omit<User, 'id'>): Promise<User>;
    updateUser(id: number, userData: Partial<User>): Promise<User>;
    deleteUser(id: number): Promise<void>;
    
    // Gestão de professores
    findAllProfessors(): Promise<User[]>;
    createProfessor(userData: Omit<User, 'id'>): Promise<User>;
    
    // Gestão de alunos
    findAllStudents(): Promise<User[]>;
    createStudent(userData: Omit<User, 'id'>): Promise<User>;
    
    // Gestão de administradores
    findAllAdmins(): Promise<User[]>;
    createAdmin(userData: Omit<User, 'id'>): Promise<User>;
    
    // Estatísticas
    getUserStats(): Promise<{
        total: number;
        admins: number;
        professors: number;
        students: number;
    }>;
} 