import { Router } from 'express';
import { container } from 'tsyringe';
import { RankingController } from '../controller/ranking_controller';
import { ensureAuthenticated } from '../../../auth/middleware/ensure_authenticated';

const rankingRouter = Router();
const rankingController = container.resolve(RankingController);

rankingRouter.use(ensureAuthenticated);

rankingRouter.get('/ranking/geral', (req, res) => 
    rankingController.handleGetRankingGeral(req, res));

rankingRouter.get('/ranking/melhores-alunos', (req, res) => 
    rankingController.handleGetMelhoresAlunos(req, res));

rankingRouter.get('/ranking/turma/:turmaId', (req, res) => 
    rankingController.handleGetRankingTurma(req, res));

rankingRouter.get('/ranking/aluno/:alunoId', (req, res) => 
    rankingController.handleGetAlunoRanking(req, res));

export default rankingRouter;