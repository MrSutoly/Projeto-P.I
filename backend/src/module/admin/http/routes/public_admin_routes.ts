import { Router } from 'express';
import { container } from 'tsyringe';
import { AdminController } from '../controller/admin_controller';

const publicAdminRoutes = Router();
const adminController = container.resolve<AdminController>('AdminController');

// Rota para criar administrador inicial (sem autenticação)
publicAdminRoutes.post('/create-initial-admin', (req, res) => adminController.createInitialAdmin(req, res));

export { publicAdminRoutes }; 