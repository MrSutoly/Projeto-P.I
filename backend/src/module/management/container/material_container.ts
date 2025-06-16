import { container } from 'tsyringe';
import { MaterialRepository } from '../repository/material_repository';
import { MaterialUseCase } from '../use-case/material_use_case';
import { MaterialController } from '../http/controller/material/material_controller';
 
// Registrar dependências
container.registerSingleton('MaterialRepository', MaterialRepository);
container.registerSingleton('MaterialUseCase', MaterialUseCase);
container.registerSingleton('MaterialController', MaterialController); 