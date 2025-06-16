import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { AlbumUseCase } from '../../use-case/album_use_case';

@injectable()
export class AlbumController {
    constructor(
        @inject('AlbumUseCase')
        private albumUseCase: AlbumUseCase
    ) {}

    async getAllAlbuns(req: Request, res: Response): Promise<Response> {
        try {
            const albuns = await this.albumUseCase.getAllAlbuns();
            return res.json(albuns);
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || 'Erro ao listar álbuns'
            });
        }
    }

    async getAlbumById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const album = await this.albumUseCase.getAlbumById(Number(id));
            
            if (!album) {
                return res.status(404).json({ message: 'Álbum não encontrado' });
            }

            return res.json(album);
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || 'Erro ao buscar álbum'
            });
        }
    }

    async getAlbunsByTurma(req: Request, res: Response): Promise<Response> {
        try {
            const { turma } = req.params;
            const albuns = await this.albumUseCase.getAlbunsByTurma(turma);
            return res.json(albuns);
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || 'Erro ao buscar álbuns por turma'
            });
        }
    }

    async getAlbunsByTipo(req: Request, res: Response): Promise<Response> {
        try {
            const { tipo } = req.params;
            const albuns = await this.albumUseCase.getAlbunsByTipo(tipo);
            return res.json(albuns);
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || 'Erro ao buscar álbuns por tipo'
            });
        }
    }

    async createAlbum(req: Request, res: Response): Promise<Response> {
        try {
            const album = await this.albumUseCase.createAlbum(req.body);
            return res.status(201).json(album);
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || 'Erro ao criar álbum'
            });
        }
    }

    async updateAlbum(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const album = await this.albumUseCase.updateAlbum(Number(id), req.body);
            return res.json(album);
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || 'Erro ao atualizar álbum'
            });
        }
    }

    async deleteAlbum(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            await this.albumUseCase.deleteAlbum(Number(id));
            return res.status(204).send();
        } catch (error: any) {
            return res.status(400).json({
                message: error.message || 'Erro ao deletar álbum'
            });
        }
    }
} 