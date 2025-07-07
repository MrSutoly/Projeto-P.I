import { injectable } from 'tsyringe';
import { selectFromTable, findOne, insertIntoTable, updateTable, deleteFromTable } from '../../../shared/database/supabase/db';
import { IAlbumRepository } from './i_album_repository';
import { Album } from '../../../shared/util/entities/album_type';

@injectable()
export class AlbumRepository implements IAlbumRepository {
    async findAll(): Promise<Album[]> {
        return await selectFromTable<Album>('albuns');
    }

    async findById(id: number): Promise<Album | null> {
        return await findOne<Album>('albuns', { id });
    }

    async findByTurma(turma: string): Promise<Album[]> {
        return await selectFromTable<Album>('albuns', '*', { turma });
    }

    async findByTipo(tipo: string): Promise<Album[]> {
        return await selectFromTable<Album>('albuns', '*', { tipo });
    }

    async create(album: Album): Promise<Album> {
        const { id, ...albumData } = album;
        const result = await insertIntoTable<Album>('albuns', albumData);
        return result;
    }

    async update(album: Album): Promise<Album> {
        const { id, ...albumData } = album;
        const result = await updateTable<Album>('albuns', albumData, { id });
        return result[0] || album;
    }

    async delete(id: number): Promise<void> {
        await deleteFromTable('albuns', { id });
    }
} 