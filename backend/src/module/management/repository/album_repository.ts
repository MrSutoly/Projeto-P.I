import { injectable } from 'tsyringe';
import { executeQuery } from '../../../shared/database/mysql/db';
import { IAlbumRepository } from './i_album_repository';
import { Album } from '../../../shared/util/entities/album_type';

@injectable()
export class AlbumRepository implements IAlbumRepository {
    async findAll(): Promise<Album[]> {
        return await executeQuery<Album[]>(
            'SELECT * FROM albuns ORDER BY created_at DESC'
        );
    }

    async findById(id: number): Promise<Album | null> {
        const [album] = await executeQuery<Album[]>(
            'SELECT * FROM albuns WHERE id = ?',
            [id]
        );
        return album || null;
    }

    async findByTurma(turma: string): Promise<Album[]> {
        return await executeQuery<Album[]>(
            'SELECT * FROM albuns WHERE turma = ? ORDER BY created_at DESC',
            [turma]
        );
    }

    async findByTipo(tipo: string): Promise<Album[]> {
        return await executeQuery<Album[]>(
            'SELECT * FROM albuns WHERE tipo = ? ORDER BY created_at DESC',
            [tipo]
        );
    }

    async create(album: Album): Promise<Album> {
        const result = await executeQuery<{ insertId: number }>(
            'INSERT INTO albuns (titulo, descricao, imagemUrl, turma, data, tipo) VALUES (?, ?, ?, ?, ?, ?)',
            [album.titulo, album.descricao, album.imagemUrl, album.turma, album.data, album.tipo]
        );
        return { ...album, id: result.insertId };
    }

    async update(album: Album): Promise<Album> {
        await executeQuery(
            'UPDATE albuns SET titulo = ?, descricao = ?, imagemUrl = ?, turma = ?, data = ?, tipo = ? WHERE id = ?',
            [album.titulo, album.descricao, album.imagemUrl, album.turma, album.data, album.tipo, album.id]
        );
        return album;
    }

    async delete(id: number): Promise<void> {
        await executeQuery(
            'DELETE FROM albuns WHERE id = ?',
            [id]
        );
    }
} 