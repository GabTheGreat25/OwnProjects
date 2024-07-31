import { FastifyRequest } from "fastify";
import { ClientSession } from "mongoose";

export interface CustomFastifyRequest extends FastifyRequest {
  session?: ClientSession;
}

export interface MetaData {
  [key: string]: any;
}

export interface Route {
  method?: string;
  path?: string;
  roles?: string[];
  middleware?: Function[];
  handler?: Function;
  preHandler?: Function | Function[];
}

export interface UploadImages {
  public_id?: string;
  url?: string;
  originalname?: string;
}

export interface TestModel {
  _id?: string;
  message: string;
  image: UploadImages[];
  deleted?: boolean;
}

export interface TestChildModel {
  _id?: string;
  test: string | TestModel;
  message: string;
  image: UploadImages[];
  deleted?: boolean;
}

export interface UserModel {
  _id?: string;
  name: string;
  email: string;
  password: string;
  image: UploadImages[];
  verificationCode: {
    code: string;
    createdAt: Date;
  };
  deleted?: boolean;
}

export interface AdminModel extends UserModel {
  roles?: string;
}

export interface EmployeeModel extends UserModel {
  roles?: string;
}

export interface CustomerModel extends UserModel {
  roles?: string;
  description: string;
}

export interface ChangePassword {
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotChangePassword {
  newPassword: string;
  confirmPassword: string;
  verificationCode: string;
}
