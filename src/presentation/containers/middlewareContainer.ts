import { container } from "tsyringe";
import UserAuth from "../middlewares/auth/user.auth";
import UploadHandler from "../middlewares/handlers/upload.handler";

// Register middlewares
container.registerSingleton(UserAuth);
container.registerSingleton(UploadHandler);

export { container as middlewareContainer };
