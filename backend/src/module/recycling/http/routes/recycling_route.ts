import { Router } from 'express';
import { container } from 'tsyringe';
import { RecyclingController } from '../controller/recycling_controller';
import { ensureAuthenticated } from '../../../auth/middleware/ensure_authenticated';
import { ensureTeacher } from '../../../auth/middleware/ensure_teacher';

const recyclingRouter = Router();
const controller = container.resolve(RecyclingController);

recyclingRouter.post(
    '/', 
    ensureAuthenticated, 
    ensureTeacher, 
    (req, res) => controller.addPoints(req, res)
);

export default recyclingRouter; 