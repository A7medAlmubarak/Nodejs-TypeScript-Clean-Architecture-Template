import { Request } from "express";
import { User } from "../../entities/User";
import { Admin } from "../../entities/Admin";

export type FileData = {
    fieldName: string;
    fileName: any;
    encoding: string;
    mimetype: string;
    ext?: string;
    data?: Buffer;
  };

  export type Auth = {
    user: User;
  };

  export type AdminAuth = {
    admin: Admin;
  };

interface AuthenticatedRequest extends Request {
    auth?: Auth
    adminAuth?: AdminAuth
    files?: FileData[];
}

export default AuthenticatedRequest;