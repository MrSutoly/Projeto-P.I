import { injectable } from 'tsyringe';
import { selectFromTable, insertIntoTable, updateTable, deleteFromTable, findOne } from '../../../shared/database/supabase/db';
import { IAlbumRepository } from './i_album_repository';
import { Album, Photo } from '../type/album_type';
import { AppError } from '../../../shared/errors/AppError';

@injectable()
export class AlbumRepository implements IAlbumRepository {
    async createAlbum(album: Album): Promise<Album> {
        const result = await insertIntoTable<Album>('albuns', album);
        return result;
    }

    async addPhoto(photo: Photo): Promise<Photo> {
        const result = await insertIntoTable<Photo>('fotos', photo);
        return result;
    }

    async findAlbumById(id: number): Promise<Album | null> {
        const album = await findOne<Album>('albuns', { id });
        return album;
    }

    async findPhotosByAlbumId(albumId: number): Promise<Photo[]> {
        const fotos = await selectFromTable<Photo>('fotos', '*', { album_id: albumId });
        // Ordenar manualmente por data_upload decrescente, convertendo para string se for Date
        return fotos.sort((a, b) => {
            const dataA = a.data_upload ? a.data_upload.toString() : '';
            const dataB = b.data_upload ? b.data_upload.toString() : '';
            return dataB.localeCompare(dataA);
        });
    }

    async findAlbumsByTurma(turmaId: number): Promise<Album[]> {
        const albuns = await selectFromTable<Album>('albuns', '*', { turma_id: turmaId });
        // Ordenar manualmente por data_criacao decrescente, convertendo para string se for Date
        return albuns.sort((a, b) => {
            const dataA = a.data_criacao ? a.data_criacao.toString() : '';
            const dataB = b.data_criacao ? b.data_criacao.toString() : '';
            return dataB.localeCompare(dataA);
        });
    }

    async deleteAlbum(id: number): Promise<void> {
        await deleteFromTable('albuns', { id });
    }

    async deletePhoto(id: number): Promise<void> {
        await deleteFromTable('fotos', { id });
    }
}