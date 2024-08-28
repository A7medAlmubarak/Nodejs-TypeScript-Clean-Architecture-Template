import { Response, Request, NextFunction } from "express";
import { UserService } from "../../application/services/patient/Patient.auth.Service";
import UserResource from "../resources/UserResource";
import AuthenticatedRequest from "../../domain/interfaces/utils/AuthenticatedRequest";
import { inject, injectable } from "tsyringe";
@injectable()
export class UserController {
  private userService: UserService;

  constructor(@inject(UserService) userService: UserService) {
    this.userService = userService;
  }

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.userService.register(req.body);
      return res.status(201).json({
        success: true,
        message: "user created successfully",
        data: await new UserResource().init(user),
      });
    } catch (error: any) {
      console.log(error);
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal server error";
      return res.status(statusCode).json({
        success: false,
        message: message,
      });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const tokens = await this.userService.login(req.body);
      return res.status(201).json({
        success: true,
        message: "user login successfully",
        data: tokens,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal server error";
      return res.status(statusCode).json({
        success: false,
        message: message,
      });
    }
  }

  async show(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const user = req.auth!.user;
      const userRecord = await this.userService.getUser(user.id);
      return res.status(201).json({
        success: true,
        message: "user returned successfully",
        data: userRecord,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal server error";
      return res.status(statusCode).json({
        success: false,
        message: message,
      });
    }
  }

  async checkEmail(req: Request, res: Response): Promise<Response> {
    try {
      const status = await this.userService.checkEmail(req.body.email);
      return res.status(201).json({
        success: true,
        message: "email status",
        data: status,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal server error";
      return res.status(statusCode).json({
        success: false,
        message: message,
      });
    }
  }

  async checkOtp(req: Request, res: Response): Promise<Response> {
    try {
      const status = await this.userService.checkEmail(req.body.email);
      return res.status(201).json({
        success: true,
        message: "email status",
        data: status,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal server error";
      return res.status(statusCode).json({
        success: false,
        message: message,
      });
    }
  }

  async resetPassword(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = req.auth!.user;

      await this.userService.resetPassword(user, oldPassword, newPassword);
      return res.status(201).json({
        success: true,
        message: "Password was reset successfully",
      });
    } catch (error: any) {
      console.log(error);
      next(error);
    }
  }

  async forgotPassword(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { token, newPassword } = req.body;
      const user = await this.userService.forgotPassword(newPassword, token);

      return res.status(201).json({
        success: true,
        message: "Password was reset successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }
}
