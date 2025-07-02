import { injectable, inject } from 'tsyringe';
import { IAlbumRepository } from '../repository/i_album_repository';
import { Album, Photo } from '../type/album_type';
import { AppError } from '../../../shared/errors/AppError';

@injectable()
export class AlbumUseCase {
    constructor(
        @inject('AlbumRepository')
        private albumRepository: IAlbumRepository
    ) {}

    async createAlbumWithPhotos(data: {
        album: Omit<Album, 'id' | 'data_criacao'>;
        photos: Array<Omit<Photo, 'id' | 'album_id' | 'data_upload'>>;
    }): Promise<Album & { fotos: Photo[] }> {
        try {
            // Validações
            if (!data.album.nome) {
                throw new AppError('Nome do álbum é obrigatório', 400);
            }

            if (!data.photos?.length) {
                throw new AppError('É necessário adicionar pelo menos uma foto', 400);
            }

            // Criar álbum
            const album = await this.albumRepository.createAlbum({
                ...data.album,
                data_criacao: new Date()
            });

            // Adicionar fotos
            const photos: Photo[] = [];
            for (const photo of data.photos) {
                if (!photo.url) {
                    throw new AppError('URL da foto é obrigatória', 400);
                }

                const savedPhoto = await this.albumRepository.addPhoto({
                    ...photo,
                    album_id: album.id!,
                    upload_por: data.album.criado_por
                });
                photos.push(savedPhoto);
            }

            return { ...album, fotos: photos };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Erro ao criar álbum com fotos', 500);
        }
    }

    async getAlbumWithPhotos(id: number): Promise<Album & { fotos: Photo[] }> {
        const album = await this.albumRepository.findAlbumById(id);
        if (!album) {
            throw new AppError('Álbum não encontrado', 404);
        }

        const photos = await this.albumRepository.findPhotosByAlbumId(id);
        return { ...album, fotos: photos };
    }

    async getClassAlbums(turmaId: number): Promise<Album[]> {
        return await this.albumRepository.findAlbumsByTurma(turmaId);
    }

    async deleteAlbumWithPhotos(id: number): Promise<void> {
        const album = await this.albumRepository.findAlbumById(id);
        if (!album) {
            throw new AppError('Álbum não encontrado', 404);
        }

        await this.albumRepository.deleteAlbum(id);
    }
}