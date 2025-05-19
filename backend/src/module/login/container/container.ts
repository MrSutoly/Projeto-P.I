import { container } from "tsyringe";
import { LoginUseCase } from "../use-case/login_use_case";
import { LoginRepository } from "../repository/login_repository";
import { ILoginRepository } from "../repository/i_login_repository";

container.registerSingleton<ILoginRepository>(
    "LoginRepository",
    LoginRepository
);

container.registerSingleton(LoginUseCase);

export { container };