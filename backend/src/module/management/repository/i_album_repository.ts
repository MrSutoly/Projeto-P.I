import { Album } from '../../../shared/util/entities/album_type';

export interface IAlbumRepository {
    findAll(): Promise<Album[]>;
    findById(id: number): Promise<Album | null>;
    findByTurma(turma: string): Promise<Album[]>;
    findByTipo(tipo: string): Promise<Album[]>;
    create(album: Album): Promise<Album>;
    update(album: Album): Promise<Album>;
    delete(id: number): Promise<void>;
} 