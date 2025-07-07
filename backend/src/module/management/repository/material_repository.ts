import { injectable } from 'tsyringe';
import { selectFromTable, findOne, insertIntoTable, updateTable, deleteFromTable } from '../../../shared/database/supabase/db';
import { IMaterialRepository } from './i_material_repository';
import { Material } from '../../../shared/util/entities/material_type';

@injectable()
export class MaterialRepository implements IMaterialRepository {
    async findAll(): Promise<Material[]> {
        return await selectFromTable<Material>('materiais');
    }

    async findById(id: number): Promise<Material | null> {
        return await findOne<Material>('materiais', { id });
    }

    async findBySemana(semana: number): Promise<Material[]> {
        return await selectFromTable<Material>('materiais', '*', { semana });
    }

    async findByTipo(tipo: string): Promise<Material[]> {
        return await selectFromTable<Material>('materiais', '*', { tipo });
    }

    async create(material: Material): Promise<Material> {
        const { id, ...materialData } = material;
        const result = await insertIntoTable<Material>('materiais', materialData);
        return result;
    }

    async update(material: Material): Promise<Material> {
        const { id, ...materialData } = material;
        const result = await updateTable<Material>('materiais', materialData, { id });
        return result[0] || material;
    }

    async delete(id: number): Promise<void> {
        await deleteFromTable('materiais', { id });
    }
} 