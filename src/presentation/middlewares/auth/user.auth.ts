import { Response, NextFunction } from "express";
import JwtService from "../../../application/services/jwt.Service";
import AuthenticatedRequest from "../../../domain/interfaces/utils/AuthenticatedRequest";
import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { inject, injectable } from "tsyringe";
import { IOAuthRepository } from "../../../domain/interfaces/repositories/IOAuthRepository";
@injectable()
class UserAuth {
  private authTokenServices: JwtService;
  private userRepo: IUserRepository;
  private oAuthRepo: IOAuthRepository;

  constructor(
    @inject(JwtService) authTokenServices: JwtService,
    @inject("IUserRepository") userRepo: IUserRepository,
    @inject("IOAuthRepository") oAuthRepo: IOAuthRepository
  ) {
    this.userRepo = userRepo;
    this.oAuthRepo = oAuthRepo;
    this.authTokenServices = authTokenServices;

    this.getUser = this.getUser.bind(this);
    this.checkUser = this.checkUser.bind(this);
    this.generateRT = this.generateRT.bind(this);
  }

  async getUser(token: string, tokenType: string) {
    if (!token) throw new Error("No Token Provided.");
    const payload = await this.authTokenServices.verify(token, tokenType);
    const user = await this.userRepo.findById(payload.userId);
    return user;
  }

  async checkUser(
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
  ) {
    try {
      const token = req.headers.authorization;
      if (!token) throw new Error("No Token Provided.");
      const user = await this.getUser(token, "acc");
      if (!user) throw new Error("Not allowed");
      const oAuth = await this.oAuthRepo.findByUser(user);

      if (user.deletedAt) throw new Error("Account is deleted");


      if (!user.isActive) throw new Error("Account is not active");

      if (oAuth?.accessToken !== token) {
        throw new Error("There is another session open, please login again");
      }

      req.auth = {
        user: user,
      };

      next();
    } catch (error: any) {
      next(error);
    }
  }

  async generateRT(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = req.headers.authorization;
      if (!token) throw new Error("No Token Provided.");
      const user = await this.getUser(token, "ref");
      if (!user) throw new Error("User not found");

      if (user.deletedAt) throw new Error("Account is deleted");

      if (!user.isActive) throw new Error("Account is not active");

      const accessToken = await this.authTokenServices.generateAccessToken(
        user.id
      );
      const refreshToken = await this.authTokenServices.generateRefreshToken(
        user.id
      );

      res.status(200).json({
        success: true,
        message: "Tokens generated successfully",
        data: { accessToken, refreshToken }
      });
    } catch (error: any) {
      next(error);
    }
  }
}

export default UserAuth;
