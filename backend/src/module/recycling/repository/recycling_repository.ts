import { injectable } from 'tsyringe';
import { selectFromTable, insertIntoTable } from '../../../shared/database/supabase/db';
import { IRecyclingRepository } from './i_recycling_repository';
import { RecyclingEntry } from '../type/recycling_type';

@injectable()
export class RecyclingRepository implements IRecyclingRepository {
    async createEntry(entry: RecyclingEntry): Promise<RecyclingEntry> {
        const { id, ...entryData } = entry;
        const result = await insertIntoTable<RecyclingEntry>('recycling_entries', entryData);
        return result;
    }

    async findEntriesByClass(turma_id: number): Promise<RecyclingEntry[]> {
        return await selectFromTable<RecyclingEntry>('recycling_entries', '*', { turma_id });
    }
} 