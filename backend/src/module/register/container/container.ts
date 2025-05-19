import { container } from "tsyringe";
import { RegisterUseCase } from '../use-case/register_use_case';
import { IRegisterRepository } from '../repository/i_register_repository';
import { RegisterRepository } from "../repository/register_repository";

container.registerSingleton<IRegisterRepository>(
    "RegisterRepository",
    RegisterRepository
);

container.registerSingleton(RegisterUseCase);

export { container };