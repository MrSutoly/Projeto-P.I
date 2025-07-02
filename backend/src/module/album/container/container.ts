import { container } from 'tsyringe';
import { IAlbumRepository } from '../repository/i_album_repository';
import { AlbumRepository } from '../repository/album_repository';
import { AlbumUseCase } from '../use-case/album_use_case';
import { AlbumController } from '../http/controller/album_controller';

// Register repositories
container.registerSingleton<IAlbumRepository>(
    'AlbumRepository',
    AlbumRepository
);

// Register use cases
container.registerSingleton(AlbumUseCase);

// Register controllers
container.registerSingleton(AlbumController);

export { container };