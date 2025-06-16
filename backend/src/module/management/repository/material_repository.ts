import { injectable } from 'tsyringe';
import { executeQuery } from '../../../shared/database/mysql/db';
import { IMaterialRepository } from './i_material_repository';
import { Material } from '../../../shared/util/entities/material_type';

@injectable()
export class MaterialRepository implements IMaterialRepository {
    async findAll(): Promise<Material[]> {
        return await executeQuery<Material[]>(
            'SELECT * FROM materiais ORDER BY semana, created_at DESC'
        );
    }

    async findById(id: number): Promise<Material | null> {
        const [material] = await executeQuery<Material[]>(
            'SELECT * FROM materiais WHERE id = ?',
            [id]
        );
        return material || null;
    }

    async findBySemana(semana: number): Promise<Material[]> {
        return await executeQuery<Material[]>(
            'SELECT * FROM materiais WHERE semana = ? ORDER BY created_at DESC',
            [semana]
        );
    }

    async findByTipo(tipo: string): Promise<Material[]> {
        return await executeQuery<Material[]>(
            'SELECT * FROM materiais WHERE tipo = ? ORDER BY semana, created_at DESC',
            [tipo]
        );
    }

    async create(material: Material): Promise<Material> {
        const result = await executeQuery<{ insertId: number }>(
            'INSERT INTO materiais (titulo, semana, topico, data, link, tipo) VALUES (?, ?, ?, ?, ?, ?)',
            [material.titulo, material.semana, material.topico, material.data, material.link, material.tipo]
        );
        return { ...material, id: result.insertId };
    }

    async update(material: Material): Promise<Material> {
        await executeQuery(
            'UPDATE materiais SET titulo = ?, semana = ?, topico = ?, data = ?, link = ?, tipo = ? WHERE id = ?',
            [material.titulo, material.semana, material.topico, material.data, material.link, material.tipo, material.id]
        );
        return material;
    }

    async delete(id: number): Promise<void> {
        await executeQuery(
            'DELETE FROM materiais WHERE id = ?',
            [id]
        );
    }
} 