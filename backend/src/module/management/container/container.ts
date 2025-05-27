import { container } from 'tsyringe';
import { IManagementRepository } from '../repository/i_management_repository';
import { ManagementRepository } from '../repository/management_repository';
import { ManagementUseCase } from '../use-case/management_use_case';

container.registerSingleton<IManagementRepository>(
    'ManagementRepository',
    ManagementRepository
);

container.registerSingleton(ManagementUseCase);

export { container };