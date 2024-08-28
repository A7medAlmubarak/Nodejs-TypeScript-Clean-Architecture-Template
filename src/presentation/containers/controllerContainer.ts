import { container } from "tsyringe";
import { ChatController } from "../controllers/Chat.Controller";
import { OtpController } from "../controllers/Otp.Controller";
import { UserController } from "../controllers/User.auth.Controller";

// Register controllers
/************************** Chat *******************************/
container.registerSingleton(ChatController);

/************************** otp *******************************/
container.registerSingleton(OtpController);

/************************** User *******************************/
container.registerSingleton(UserController);

export { container as controllerContainer };
