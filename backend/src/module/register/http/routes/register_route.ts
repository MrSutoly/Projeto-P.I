import { Router } from 'express';
import { container } from 'tsyringe';
import { RegisterController } from '../controller/register_controller';

const registerRouter = Router();
const registerController = container.resolve(RegisterController)

registerRouter.post('/register', (req, res)=>{
    return registerController.handle(req, res);
})

export default registerRouter;