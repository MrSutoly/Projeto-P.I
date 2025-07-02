import { container } from 'tsyringe';
import { IRecyclingRepository } from '../repository/i_recycling_repository';
import { RecyclingRepository } from '../repository/recycling_repository';
import { RecyclingUseCase } from '../use-case/recycling_use_case';
import { RecyclingController } from '../http/controller/recycling_controller';

container.registerSingleton<IRecyclingRepository>(
    'RecyclingRepository',
    RecyclingRepository
);

container.registerSingleton(RecyclingUseCase);
container.registerSingleton(RecyclingController);

export { container }; 