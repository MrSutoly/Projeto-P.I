import { container } from 'tsyringe';
import { IQuizRepository } from '../repository/i_quiz_repository';
import { QuizRepository } from '../repository/quiz_repository';
import { QuizUseCase } from '../use-case/quiz_use_case';
import { QuizController } from '../http/controller/quiz_controller';

container.registerSingleton<IQuizRepository>(
    'QuizRepository',
    QuizRepository
);

container.registerSingleton(QuizUseCase);
container.registerSingleton(QuizController); 