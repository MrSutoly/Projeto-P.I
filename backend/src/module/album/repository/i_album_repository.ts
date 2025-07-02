import { Album, Photo } from '../type/album_type';

export interface IAlbumRepository {
    createAlbum(album: Album): Promise<Album>;
    addPhoto(photo: Photo): Promise<Photo>;
    findAlbumById(id: number): Promise<Album | null>;
    findPhotosByAlbumId(albumId: number): Promise<Photo[]>;
    findAlbumsByTurma(turmaId: number): Promise<Album[]>;
    deleteAlbum(id: number): Promise<void>;
    deletePhoto(id: number): Promise<void>;
}