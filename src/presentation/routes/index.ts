import { Router } from "express";
import userRoute from "./user/user.auth.route";
import authRoutes from "./authRoutes";
import otpRoute from "./otp/otp.route";
import chatRoute from "./chat/chat.route";

class IndexRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use("/user", userRoute);
    this.router.use("/otp", otpRoute);
    this.router.use("/chat", chatRoute);
    this.router.use("/google", authRoutes);
  }
}

export default new IndexRouter().router;
