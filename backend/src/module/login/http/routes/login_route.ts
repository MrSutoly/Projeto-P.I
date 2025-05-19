import { Router } from 'express';
import { container } from 'tsyringe';
import { LoginController } from '../controller/login_controller';

const loginRouter = Router();
const loginController = container.resolve(LoginController)

loginRouter.post('/login', (req, res)=>{
    return loginController.handle(req, res);
})

export default loginRouter;