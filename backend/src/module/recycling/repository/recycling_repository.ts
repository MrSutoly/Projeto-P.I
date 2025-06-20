import { injectable } from 'tsyringe';
import { executeQuery } from '../../../shared/database/mysql/db';
import { IRecyclingRepository } from './i_recycling_repository';
import { RecyclingEntry } from '../type/recycling_type';

@injectable()
export class RecyclingRepository implements IRecyclingRepository {
    async createEntry(entry: RecyclingEntry): Promise<RecyclingEntry> {
        const result = await executeQuery<{ insertId: number }>(
            'INSERT INTO recycling_entries (turma_id, professor_id, pontos, motivo) VALUES (?, ?, ?, ?)',
            [entry.turma_id, entry.professor_id, entry.pontos, entry.motivo]
        );
        return { ...entry, id: result.insertId };
    }

    async findEntriesByClass(turma_id: number): Promise<RecyclingEntry[]> {
        return await executeQuery<RecyclingEntry[]>(
            'SELECT * FROM recycling_entries WHERE turma_id = ? ORDER BY criado_em DESC',
            [turma_id]
        );
    }
} 