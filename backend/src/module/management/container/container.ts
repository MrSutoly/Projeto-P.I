import { container } from 'tsyringe';
import { IManagementRepository } from '../repository/i_management_repository';
import { ManagementRepository } from '../repository/management_repository';
import { ManagementUseCase } from '../use-case/management_use_case';
import { RankingController } from '../http/controller/ranking_controller';
import { AtividadeController } from '../http/controller/atividade_controller';

// Importar container de materiais
import './material_container';

container.registerSingleton<IManagementRepository>(
    'ManagementRepository',
    ManagementRepository
);

container.registerSingleton(ManagementUseCase);
container.registerSingleton(RankingController);
container.registerSingleton(AtividadeController);

export { container };