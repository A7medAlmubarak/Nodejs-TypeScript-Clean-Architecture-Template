import { container } from "tsyringe";
import JwtService from "../../application/services/jwt.Service";
import { ChatService } from "../../application/services/chat/Chat.Service";
import OtpService from "../../application/services/Otp.Service";
import { EmailService } from "../../application/services/Email.Service";
import Scheduler from "../../application/services/Scheduler.Service";
import { UserService } from "../../application/services/User.auth.Service";

// Register services
/************************** Chat *******************************/
container.registerSingleton(ChatService);

/************************** email *******************************/
container.registerSingleton(EmailService);

/************************** JWT *******************************/
container.registerSingleton(JwtService);

/************************** otp *******************************/
container.registerSingleton(OtpService);

/************************** Scheduler *******************************/
container.registerSingleton(Scheduler);

/************************** User *******************************/
container.registerSingleton(UserService);

export { container as serviceContainer };
