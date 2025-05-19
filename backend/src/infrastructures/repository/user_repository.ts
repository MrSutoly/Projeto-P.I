import { executeQuery } from '../../shared/database/mysql/db';
import { IUserRepository } from '../../domains/repositorys/i_user_repository';
import { User } from '../../domains/entities/user_type';
import { Class } from '../../domains/entities/class_type';

export class UserRepository implements IUserRepository {
    async GetAll(): Promise<User[]> {
        return await executeQuery<User[]>('SELECT * FROM usuarios');
    }

    async GetById(id: number): Promise<User | null> {
        const [user] = await executeQuery<User[]>(
            'SELECT * FROM usuarios WHERE id = ?',
            [id]
        );
        return user || null;
    }

    async CreateUser(user: User): Promise<User> {
        const result = await executeQuery<any>(
            'INSERT INTO usuarios (nome, email, password, role) VALUES (?, ?, ?, ?)',
            [user.nome, user.email, user.password, user.role]
        );
        return { ...user, id: result.insertId };
    }

    async CreateClass(classData: Class): Promise<Class> {
        const result = await executeQuery<any>(
            'INSERT INTO turmas (nome, codigo) VALUES (?, ?)',
            [classData.nome, classData.codigo]
        );
        return { ...classData, id: result.insertId };
    }

    async UserToClass(userId: number, classId: number): Promise<void> {
        await executeQuery(
            'UPDATE usuarios SET turma_id = ? WHERE id = ?',
            [classId, userId]
        );
    }
}