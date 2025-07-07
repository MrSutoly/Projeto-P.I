import { Router } from 'express';
import { container } from 'tsyringe';
import { AdminController } from '../controller/admin_controller';
import { ensureAuthenticated } from '../../../auth/middleware/ensure_authenticated';
import { ensureAdmin } from '../../../auth/middleware/ensure_admin';

const adminRoutes = Router();
const adminController = container.resolve<AdminController>('AdminController');

// Middleware para todas as rotas de admin
adminRoutes.use(ensureAuthenticated);
adminRoutes.use(ensureAdmin);

// Dashboard
adminRoutes.get('/dashboard', (req, res) => adminController.getDashboard(req, res));

// Gestão de usuários
adminRoutes.get('/users', (req, res) => adminController.getAllUsers(req, res));
adminRoutes.get('/users/:id', (req, res) => adminController.getUserById(req, res));
adminRoutes.put('/users/:id', (req, res) => adminController.updateUser(req, res));
adminRoutes.delete('/users/:id', (req, res) => adminController.deleteUser(req, res));

// Gestão de professores
adminRoutes.get('/professors', (req, res) => adminController.getAllProfessors(req, res));
adminRoutes.post('/professors', (req, res) => adminController.createProfessor(req, res));

// Gestão de alunos
adminRoutes.get('/students', (req, res) => adminController.getAllStudents(req, res));
adminRoutes.post('/students', (req, res) => adminController.createStudent(req, res));

// Gestão de administradores
adminRoutes.get('/admins', (req, res) => adminController.getAllAdmins(req, res));
adminRoutes.post('/admins', (req, res) => adminController.createAdmin(req, res));

export { adminRoutes }; 