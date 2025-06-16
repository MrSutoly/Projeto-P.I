import { Material } from '../../../shared/util/entities/material_type';

export interface IMaterialRepository {
    findAll(): Promise<Material[]>;
    findById(id: number): Promise<Material | null>;
    findBySemana(semana: number): Promise<Material[]>;
    findByTipo(tipo: string): Promise<Material[]>;
    create(material: Material): Promise<Material>;
    update(material: Material): Promise<Material>;
    delete(id: number): Promise<void>;
} 