import { container } from 'tsyringe';
import { AdminUseCase } from '../use-case/admin_use_case';
import { AdminRepository } from '../repository/admin_repository';
import { IAdminRepository } from '../repository/i_admin_repository';
import { AdminController } from '../http/controller/admin_controller';

container.registerSingleton<IAdminRepository>('AdminRepository', AdminRepository);
container.registerSingleton<AdminUseCase>('AdminUseCase', AdminUseCase);
container.registerSingleton<AdminController>('AdminController', AdminController);

export { container }; 