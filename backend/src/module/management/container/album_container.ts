import { container } from 'tsyringe';
import { AlbumRepository } from '../repository/album_repository';
import { AlbumUseCase } from '../use-case/album_use_case';
import { AlbumController } from '../http/controller/album_controller';

container.registerSingleton('AlbumRepository', AlbumRepository);
container.registerSingleton('AlbumUseCase', AlbumUseCase);
container.registerSingleton('AlbumController', AlbumController); 