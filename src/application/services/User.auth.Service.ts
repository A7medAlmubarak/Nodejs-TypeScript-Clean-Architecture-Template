import { inject, injectable } from "tsyringe";
import bcrypt from "bcrypt";
import { IUserRepository } from "../../domain/interfaces/repositories/IUserRepository";
import { IOAuthRepository } from "../../domain/interfaces/repositories/IOAuthRepository";
import { EmailService } from "./Email.Service";
import OtpService from "./Otp.Service";
import JwtService from "./jwt.Service";
import { NotificationService } from "./Notification.Service";
import { User } from "../../domain/entities/User";
import { connectToDatabase } from "../../infrastructure/database";

@injectable()
export class UserService {
  private userRepository!: IUserRepository;
  private oAuthRepository!: IOAuthRepository;
  private emailService!: EmailService;
  private otpService!: OtpService;
  private jwtService!: JwtService;
  private notificationService!: NotificationService;

  constructor(
    @inject("IUserRepository") userRepository: IUserRepository,
    @inject("IOAuthRepository") oAuthRepository: IOAuthRepository,
    @inject(OtpService) otpService: OtpService,
    @inject(EmailService) emailService: EmailService,
    @inject(JwtService) jwtService: JwtService,
    @inject(NotificationService) notificationService: NotificationService
  ) {
    this.userRepository = userRepository;
    this.oAuthRepository = oAuthRepository;
    this.otpService = otpService;
    this.emailService = emailService;
    this.jwtService = jwtService;
    this.notificationService = notificationService;
  }

  async register(input: any): Promise<User> {
    let otp;
      let newUser;

    await (
      await connectToDatabase()
    ).transaction(async (transactionalEntityManager) => {
      newUser = (await this.userRepository.register(
        input,
        transactionalEntityManager
      )) as any;
      input.userId = newUser.id;
    });
    otp = await this.otpService.create(newUser!.id);
    if (otp) {
      this.emailService.sendEmail(
        newUser!.email,
        "email Verification",
        `Your OTP is: ${otp.token}`
      );
    }
    return newUser!;
  }

  async login(input: any): Promise<any> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }
    if (!user.isActive) {
      throw new Error("Email not verified");
    }

    const accessToken = await this.jwtService.generateAccessToken(user.id);
    const refreshToken = await this.jwtService.generateRefreshToken(user.id);
    let oAuthRecord = await this.oAuthRepository.findByUser(user);
    if (oAuthRecord) {
      oAuthRecord.accessToken = accessToken;
      oAuthRecord.refreshToken = refreshToken;
      await this.oAuthRepository.update(oAuthRecord);
    } else {
      await this.oAuthRepository.create(accessToken, refreshToken, user);
    }

    return {  accessToken, refreshToken };
  }

  async getUser(userId: number): Promise<User | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not found");
    return user;
  }

  async checkEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");
    return user.isActive;
  }

  async resetPassword(user: User, oldPassword: string, newPassword: string): Promise<void> {
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      throw new Error("Invalid password");
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await this.userRepository.updateUser(user);
  }

  async forgotPassword(newPassword: string, token: string): Promise<User> {
    const otpRecord = await this.otpService.checkToken(Number(token));

    const user = await this.userRepository.findById(otpRecord.userId);

    if (!user) throw new Error("User not found.");

    user.password = await bcrypt.hash(newPassword, 10);

    otpRecord.verified = true;

    await (
      await connectToDatabase()
    ).transaction(async (transactionalEntityManager) => {
      await this.userRepository.updateUser(user, transactionalEntityManager);
      await this.otpService.update(otpRecord, transactionalEntityManager);
    });
    return user;
  }
}
