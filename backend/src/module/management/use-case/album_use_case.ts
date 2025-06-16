import { injectable, inject } from 'tsyringe';
import { IAlbumRepository } from '../repository/i_album_repository';
import { Album, CreateAlbumRequest } from '../../../shared/util/entities/album_type';

@injectable()
export class AlbumUseCase {
    constructor(
        @inject('AlbumRepository')
        private albumRepository: IAlbumRepository
    ) {}

    async getAllAlbuns(): Promise<Album[]> {
        return await this.albumRepository.findAll();
    }

    async getAlbumById(id: number): Promise<Album | null> {
        return await this.albumRepository.findById(id);
    }

    async getAlbunsByTurma(turma: string): Promise<Album[]> {
        return await this.albumRepository.findByTurma(turma);
    }

    async getAlbunsByTipo(tipo: string): Promise<Album[]> {
        return await this.albumRepository.findByTipo(tipo);
    }

    async createAlbum(albumRequest: CreateAlbumRequest): Promise<Album> {
        const album: Album = {
            ...albumRequest
        };
        return await this.albumRepository.create(album);
    }

    async updateAlbum(id: number, albumRequest: CreateAlbumRequest): Promise<Album> {
        const existingAlbum = await this.albumRepository.findById(id);
        if (!existingAlbum) {
            throw new Error('Álbum não encontrado');
        }

        const updatedAlbum: Album = {
            ...existingAlbum,
            ...albumRequest,
            id
        };

        return await this.albumRepository.update(updatedAlbum);
    }

    async deleteAlbum(id: number): Promise<void> {
        const existingAlbum = await this.albumRepository.findById(id);
        if (!existingAlbum) {
            throw new Error('Álbum não encontrado');
        }

        await this.albumRepository.delete(id);
    }
} 