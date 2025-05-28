import { container } from 'tsyringe';
import { Router } from 'express';
import { ManagementController as GetAllController } from '../controller/user/get_all_user';
import { ManagementController as GetByIdController } from '../controller/user/get_user_by_id';
import { ManagementController as GetByClassController } from '../controller/user/get_user_by_class';
import { ManagementController as CreateController } from '../controller/user/post_user';
import { UpdateUserController } from '../controller/user/put_user'; // Corrigido aqui
import { ManagementController as DeleteController } from '../controller/user/delete_user';
import { ensureAuthenticated } from '../../../auth/middleware/ensure_authenticated';

const userRouter = Router();

const getAllUsers = container.resolve(GetAllController);
const getUserById = container.resolve(GetByIdController);
const getUsersByClass = container.resolve(GetByClassController);
const createUser = container.resolve(CreateController);
const updateUser = container.resolve(UpdateUserController); // Corrigido aqui
const deleteUser = container.resolve(DeleteController);

userRouter.use(ensureAuthenticated);

userRouter.get('/users', (req, res) => getAllUsers.handleGetAllUsers(req, res));
userRouter.get('/users/:id', (req, res) => getUserById.handleGetUser(req, res));
userRouter.get('/users/class/:classId', (req, res) => getUsersByClass.handleGetUsersByClass(req, res));
userRouter.post('/users', (req, res) => createUser.handleCreateUser(req, res));
userRouter.put('/users/:id', (req, res) => updateUser.handle(req, res)); // Corrigido método para handle
userRouter.delete('/users/:id', (req, res) => deleteUser.handleDeleteUser(req, res));

export default userRouter;