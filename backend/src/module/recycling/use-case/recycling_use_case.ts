import { injectable, inject } from 'tsyringe';
import { IRecyclingRepository } from '../repository/i_recycling_repository';
import { IManagementRepository } from '../../management/repository/i_management_repository';
import { RecyclingEntry } from '../type/recycling_type';
import { AppError } from '../../../shared/errors/AppError';

@injectable()
export class RecyclingUseCase {
    constructor(
        @inject('RecyclingRepository')
        private recyclingRepository: IRecyclingRepository,
        @inject('ManagementRepository')
        private managementRepository: IManagementRepository
    ) {}

    async addPointsToClass(data: { turma_id: number; professor_id: number; pontos: number; motivo: string }): Promise<RecyclingEntry> {
        const turma = await this.managementRepository.findClassById(data.turma_id);
        if (!turma) {
            throw new AppError('Turma não encontrada.', 404);
        }

        if (turma.professor_id !== data.professor_id) {
            throw new AppError('Este professor não tem permissão para adicionar pontos a esta turma.', 403);
        }

        if (data.pontos <= 0) {
            throw new AppError('A quantidade de pontos deve ser positiva.', 400);
        }

        if (!data.motivo || data.motivo.trim() === '') {
            throw new AppError('O motivo da pontuação é obrigatório.', 400);
        }

        const novosPontos = (turma.pontos || 0) + data.pontos;
        
        await this.managementRepository.updateClass({
            ...turma,
            pontos: novosPontos
        });

        const entry: RecyclingEntry = {
            turma_id: data.turma_id,
            professor_id: data.professor_id,
            pontos: data.pontos,
            motivo: data.motivo,
        };

        return this.recyclingRepository.createEntry(entry);
    }
} 