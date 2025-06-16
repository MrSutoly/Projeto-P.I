import { injectable, inject } from 'tsyringe';
import { IMaterialRepository } from '../repository/i_material_repository';
import { Material, CreateMaterialRequest } from '../../../shared/util/entities/material_type';

@injectable()
export class MaterialUseCase {
    constructor(
        @inject('MaterialRepository')
        private materialRepository: IMaterialRepository
    ) {}

    async getAllMaterials(): Promise<Material[]> {
        return await this.materialRepository.findAll();
    }

    async getMaterialById(id: number): Promise<Material | null> {
        return await this.materialRepository.findById(id);
    }

    async getMaterialsBySemana(semana: number): Promise<Material[]> {
        return await this.materialRepository.findBySemana(semana);
    }

    async getMaterialsByTipo(tipo: string): Promise<Material[]> {
        return await this.materialRepository.findByTipo(tipo);
    }

    async createMaterial(materialData: CreateMaterialRequest): Promise<Material> {
        const material: Material = {
            titulo: materialData.titulo,
            semana: materialData.semana,
            topico: materialData.topico,
            data: materialData.data,
            link: materialData.link,
            tipo: materialData.tipo
        };

        return await this.materialRepository.create(material);
    }

    async updateMaterial(id: number, materialData: CreateMaterialRequest): Promise<Material> {
        const existingMaterial = await this.materialRepository.findById(id);
        if (!existingMaterial) {
            throw new Error('Material não encontrado');
        }

        const updatedMaterial: Material = {
            ...existingMaterial,
            titulo: materialData.titulo,
            semana: materialData.semana,
            topico: materialData.topico,
            data: materialData.data,
            link: materialData.link,
            tipo: materialData.tipo
        };

        return await this.materialRepository.update(updatedMaterial);
    }

    async deleteMaterial(id: number): Promise<void> {
        const existingMaterial = await this.materialRepository.findById(id);
        if (!existingMaterial) {
            throw new Error('Material não encontrado');
        }

        await this.materialRepository.delete(id);
    }
} 