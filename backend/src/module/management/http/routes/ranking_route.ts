import { Router } from 'express';
import { container } from 'tsyringe';
import { RankingController } from '../controller/ranking_controller';
import { ensureAuthenticated } from '../../../auth/middleware/ensure_authenticated';

const rankingRouter = Router();
const rankingController = container.resolve(RankingController);

// Rota protegida para buscar ranking
rankingRouter.get('/ranking', ensureAuthenticated, (req, res) => 
  rankingController.getRanking(req, res)
);

export default rankingRouter; 