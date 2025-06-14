import { Router } from 'express';
import { container } from 'tsyringe';
import { AlbumController } from '../controller/album_controller';
import { ensureAuthenticated } from '../../../auth/middleware/ensure_authenticated';
import { ensureTeacher } from '../../../auth/middleware/ensure_teacher';

const albumRouter = Router();
const albumController = container.resolve(AlbumController);

albumRouter.use(ensureAuthenticated);

// Rotas protegidas
albumRouter.post('/albums', ensureTeacher, (req, res) => 
    albumController.createAlbumWithPhotos(req, res));

albumRouter.get('/albums/:id', (req, res) => 
    albumController.getAlbum(req, res));

albumRouter.get('/class/:turmaId/albums', (req, res) => 
    albumController.getClassAlbums(req, res));

albumRouter.delete('/albums/:id', ensureTeacher, (req, res) => 
    albumController.deleteAlbum(req, res));

export default albumRouter;