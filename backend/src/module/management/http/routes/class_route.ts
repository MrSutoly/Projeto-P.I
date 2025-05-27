import { container } from 'tsyringe';
import { Router } from 'express';
import { ManagementController } from '../controller/class/get_all_class';
import { ManagementController as GetByIdController } from '../controller/class/get_class_by_id';
import { ManagementController as CreateController } from '../controller/class/post_class';
import { ManagementController as UpdateController } from '../controller/class/put_class';
import { ManagementController as DeleteController } from '../controller/class/delete_class';
import { ensureAuthenticated } from '../../../auth/middleware/ensure_authenticated';

const classRouter = Router();

const getAllClasses = container.resolve(ManagementController);
const getClassById = container.resolve(GetByIdController);
const createClass = container.resolve(CreateController);
const updateClass = container.resolve(UpdateController);
const deleteClass = container.resolve(DeleteController);

classRouter.use(ensureAuthenticated);

classRouter.get('/classes', (req, res) => getAllClasses.handleGetAllClasses(req, res));
classRouter.get('/classes/:id', (req, res) => getClassById.handleGetClass(req, res));
classRouter.post('/classes', (req, res) => createClass.handleCreateClass(req, res));
classRouter.put('/classes/:id', (req, res) => updateClass.handleUpdateClass(req, res));
classRouter.delete('/classes/:id', (req, res) => deleteClass.handleDeleteClass(req, res));

export default classRouter;