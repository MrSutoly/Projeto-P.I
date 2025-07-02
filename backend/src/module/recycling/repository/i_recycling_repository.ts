import { RecyclingEntry } from '../type/recycling_type';

export interface IRecyclingRepository {
    createEntry(entry: RecyclingEntry): Promise<RecyclingEntry>;
    findEntriesByClass(turma_id: number): Promise<RecyclingEntry[]>;
} 