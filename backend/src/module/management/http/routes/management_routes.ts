import { Router } from 'express';
import userRouter from './user_route';
import classRouter from './class_route';

const managementRouter = Router();

managementRouter.use(userRouter);
managementRouter.use(classRouter);

export default managementRouter;