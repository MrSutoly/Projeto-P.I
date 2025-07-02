import { container } from 'tsyringe';
import { IRankingRepository } from '../repository/i_ranking_repository';
import { RankingRepository } from '../repository/ranking_repository';
import { RankingUseCase } from '../use-case/ranking_use_case';
import { RankingController } from '../http/controller/ranking_controller';

// Register Repository
container.registerSingleton<IRankingRepository>(
    'RankingRepository',
    RankingRepository
);

// Register Use Case
container.registerSingleton(RankingUseCase);

// Register Controller
container.registerSingleton(RankingController);

export { container };