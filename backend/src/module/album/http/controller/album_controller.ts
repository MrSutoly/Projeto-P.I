import { injectable, inject } from 'tsyringe';
import { Response } from 'express';
import { AlbumUseCase } from '../../use-case/album_use_case';
import { AppError } from '../../../../shared/errors/AppError';
import { AuthenticatedRequest } from '../../../../shared/types/express';

@injectable()
export class AlbumController {
    constructor(
        @inject(AlbumUseCase)
        private albumUseCase: AlbumUseCase
    ) {}

    async createAlbumWithPhotos(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const { nome, descricao, fotos } = req.body;
            const criado_por = req.user?.id;

            if (!criado_por) {
                throw new AppError('Usuário não autenticado', 401);
            }

            const album = await this.albumUseCase.createAlbumWithPhotos({
                album: {
                    nome,
                    descricao,
                    criado_por
                },
                photos: fotos
            });

            return res.status(201).json(album);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    message: error.message
                });
            }
            return res.status(500).json({
                message: 'Erro interno do servidor'
            });
        }
    }

    async getAlbum(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const album = await this.albumUseCase.getAlbumWithPhotos(Number(id));
            return res.json(album);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    message: error.message
                });
            }
            return res.status(500).json({
                message: 'Erro interno do servidor'
            });
        }
    }

    async getClassAlbums(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const { turmaId } = req.params;
            const albums = await this.albumUseCase.getClassAlbums(Number(turmaId));
            return res.json(albums);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    message: error.message
                });
            }
            return res.status(500).json({
                message: 'Erro interno do servidor'
            });
        }
    }

    async deleteAlbum(req: AuthenticatedRequest, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            await this.albumUseCase.deleteAlbumWithPhotos(Number(id));
            return res.status(204).send();
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    message: error.message
                });
            }
            return res.status(500).json({
                message: 'Erro interno do servidor'
            });
        }
    }
}