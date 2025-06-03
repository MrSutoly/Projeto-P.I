import { container } from 'tsyringe';
import { IQuizRepository } from '../repository/i_quiz_repository';
import { QuizRepository } from '../repository/quiz_repository';
import { CreateQuizUseCase } from '../use-case/quiz_use_case'; 

container.registerSingleton<IQuizRepository>(
    'QuizRepository',
    QuizRepository
);

container.registerSingleton(CreateQuizUseCase);

export { container };