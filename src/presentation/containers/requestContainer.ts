import { container } from "tsyringe";
import UserValidator from "../request/userRegister.request";

// Register requests
container.registerSingleton(UserValidator);
export { container as requestContainer };
