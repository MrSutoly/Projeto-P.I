import { Router } from 'express';
import { container } from 'tsyringe';
import { AlbumController } from '../controller/album_controller';
import { ensureAuthenticated } from '../../../auth/middleware/ensure_authenticated';
import { ensureTeacher } from '../../../auth/middleware/ensure_teacher';

const albumRouter = Router();
const albumController = container.resolve(AlbumController);

// Rotas públicas (para alunos visualizarem)
albumRouter.get('/', ensureAuthenticated, (req, res) => albumController.getAllAlbuns(req, res));
albumRouter.get('/:id', ensureAuthenticated, (req, res) => albumController.getAlbumById(req, res));
albumRouter.get('/turma/:turma', ensureAuthenticated, (req, res) => albumController.getAlbunsByTurma(req, res));
albumRouter.get('/tipo/:tipo', ensureAuthenticated, (req, res) => albumController.getAlbunsByTipo(req, res));

// Rotas protegidas (apenas professores)
albumRouter.post('/', ensureAuthenticated, ensureTeacher, (req, res) => albumController.createAlbum(req, res));
albumRouter.put('/:id', ensureAuthenticated, ensureTeacher, (req, res) => albumController.updateAlbum(req, res));
albumRouter.delete('/:id', ensureAuthenticated, ensureTeacher, (req, res) => albumController.deleteAlbum(req, res));

export { albumRouter }; 