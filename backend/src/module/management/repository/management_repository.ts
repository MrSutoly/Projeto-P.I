import { injectable } from 'tsyringe';
import { executeQuery } from "../../../shared/database/mysql/db";
import { IManagementRepository } from "./i_management_repository";
import { User } from '../../../shared/util/entities/user_type';
import { Class } from '../../../shared/util/entities/class_type';

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

    async findUserByClass(ClassId: number): Promise<User[]> {
        const users = await executeQuery<User[]>(
            'SELECT * FROM usuarios WHERE turma_id = ?', 
            [ClassId]
        );
        return users;
    }

    async create(user: User): Promise<User> {
        const result = await executeQuery<{ insertId: number }>(
            'INSERT INTO usuarios (nome, email, password, role, turma_id) VALUES (?, ?, ?, ?, ?)', 
            [user.nome, user.email, user.password, user.role, user.turma_id]
        );
        return { ...user, id: result.insertId };
    }

    async update(user: User): Promise<User> {
        await executeQuery(
            'UPDATE usuarios SET nome = ?, email = ?, password = ?, role = ?, turma_id = ? WHERE id = ?',
            [user.nome, user.email, user.password, user.role, user.turma_id, user.id]
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
}