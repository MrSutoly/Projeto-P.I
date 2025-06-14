import { injectable } from 'tsyringe';
import { executeQuery } from '../../../shared/database/mysql/db';
import { IAlbumRepository } from './i_album_repository';
import { Album, Photo } from '../type/album_type';
import { AppError } from '../../../shared/errors/AppError';

@injectable()
export class AlbumRepository implements IAlbumRepository {
    async createAlbum(album: Album): Promise<Album> {
        const result = await executeQuery<{ insertId: number }>(
            'INSERT INTO albuns (nome, descricao, data_criacao, turma_id, criado_por) VALUES (?, ?, ?, ?, ?)',
            [album.nome, album.descricao, album.data_criacao, album.turma_id, album.criado_por]
        );
        return { ...album, id: result.insertId };
    }

    async addPhoto(photo: Photo): Promise<Photo> {
        const result = await executeQuery<{ insertId: number }>(
            'INSERT INTO fotos (url, legenda, album_id, upload_por) VALUES (?, ?, ?, ?)',
            [photo.url, photo.legenda, photo.album_id, photo.upload_por]
        );
        return { ...photo, id: result.insertId };
    }

    async findAlbumById(id: number): Promise<Album | null> {
        const [album] = await executeQuery<Album[]>(
            'SELECT * FROM albuns WHERE id = ?',
            [id]
        );
        return album || null;
    }

    async findPhotosByAlbumId(albumId: number): Promise<Photo[]> {
        return await executeQuery<Photo[]>(
            'SELECT * FROM fotos WHERE album_id = ? ORDER BY data_upload DESC',
            [albumId]
        );
    }

    async findAlbumsByTurma(turmaId: number): Promise<Album[]> {
        return await executeQuery<Album[]>(
            'SELECT * FROM albuns WHERE turma_id = ? ORDER BY data_criacao DESC',
            [turmaId]
        );
    }

    async deleteAlbum(id: number): Promise<void> {
        await executeQuery(
            'DELETE FROM albuns WHERE id = ?',
            [id]
        );
    }

    async deletePhoto(id: number): Promise<void> {
        await executeQuery(
            'DELETE FROM fotos WHERE id = ?',
            [id]
        );
    }
}