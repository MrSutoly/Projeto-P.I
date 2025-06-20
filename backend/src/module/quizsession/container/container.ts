import { container } from 'tsyringe';
import { IQuizSessionRepository } from '../repository/i_quizsession_repository';
import { QuizSessionRepository } from '../repository/quizsession_repository';
import { QuizSessionUseCase } from '../use-case/quizsession_use_case';
import { QuizSessionController } from '../http/controller/session';

container.registerSingleton<IQuizSessionRepository>(
    'QuizSessionRepository',
    QuizSessionRepository
);

container.registerSingleton(QuizSessionUseCase);
container.registerSingleton(QuizSessionController);

export { container };