import { container } from 'tsyringe';
import { AtividadeRepository } from '../repository/atividade_repository';
import { AtividadeUseCase } from '../use-case/atividade_use_case';
import { IAtividadeRepository } from '../repository/i_atividade_repository';

// Registrar o repositório
container.registerSingleton<IAtividadeRepository>(
    'AtividadeRepository',
    AtividadeRepository
);

// Registrar o use case
container.registerSingleton(AtividadeUseCase);

console.log('Container de Atividades registrado com sucesso!'); 