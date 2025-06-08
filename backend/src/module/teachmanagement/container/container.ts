import { container } from 'tsyringe';
import { TeachRepository } from '../repository/teach_repository';
import { ITeachRepository } from '../repository/i_teach_repository';

container.registerSingleton<ITeachRepository>(
    'TeachRepository',
    TeachRepository
); 