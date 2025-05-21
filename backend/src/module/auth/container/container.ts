import { container } from 'tsyringe';
import { JWTService } from '../services/jwt_service';

container.registerSingleton(JWTService);

export { container };