// src/container/repositoryContainer.ts
import { container } from "tsyringe";
import { UserMysqlRepository } from "../../infrastructure/database/repositories/mysql/user.mysql.Repository";
import { IUserRepository } from "../../domain/interfaces/repositories/IUserRepository";
import { IOtpRepository } from "../../domain/interfaces/repositories/IOtpRepository";
import { OtpMysqlRepository } from "../../infrastructure/database/repositories/mysql/otp.mysql.Repository";
import { IOAuthRepository } from "../../domain/interfaces/repositories/IOAuthRepository";
import { OAuthMysqlRepository } from "../../infrastructure/database/repositories/mysql/OAuth.mysql.Repository";
import { INotificationRepository } from "../../domain/interfaces/repositories/INotificationRepository";
import { NotificationMysqlRepository } from "../../infrastructure/database/repositories/mysql/Notification.mysql.Repository";

// Register repositories

/************************** Chat *******************************/


/************************** Notification *******************************/
container.register<INotificationRepository>("INotificationRepository", {
  useClass: NotificationMysqlRepository,
});

/************************** oAuth *******************************/
container.register<IOAuthRepository>("IOAuthRepository", {
  useClass: OAuthMysqlRepository,
});

/************************** otp *******************************/
container.register<IOtpRepository>("IOtpRepository", {
  useClass: OtpMysqlRepository,
});

/************************** User *******************************/
container.register<IUserRepository>("IUserRepository", {
  useClass: UserMysqlRepository,
});

export { container as repositoryContainer };
