import { ClientSession } from "mongoose";

declare module "express-serve-static-core" {
  interface Request {
    session?: ClientSession;
  }
}

export interface MetaData {
  [key: string]: any;
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
