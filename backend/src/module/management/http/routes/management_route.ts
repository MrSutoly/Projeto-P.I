import { Router } from 'express';
import userRouter from './user_route';
import classRouter from './class_route';
import materialRouter from './material_route';
import { albumRouter } from './album_route';
import rankingRouter from './ranking_route';
import atividadeRouter from './atividade_route';

const managementRouter = Router();

managementRouter.use(userRouter);
managementRouter.use(classRouter);
managementRouter.use(materialRouter);
managementRouter.use('/albums', albumRouter);
managementRouter.use(rankingRouter);
managementRouter.use(atividadeRouter);

export default managementRouter;