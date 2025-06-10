import { container } from 'tsyringe';
import { ITeachRepository } from '../repository/i_teach_repository';
import { TeachRepository } from '../repository/teach_repository';
import { TeachUseCase } from '../use-case/teach_use_case';
import { TeachController } from '../http/controller/teach_controller';

container.registerSingleton<ITeachRepository>(
    'TeachRepository',
    TeachRepository
);

container.registerSingleton(TeachUseCase);
container.registerSingleton(TeachController);

export { container };