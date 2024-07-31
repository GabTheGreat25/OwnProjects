import model from "./model";
import {
  AdminDiscriminator,
  EmployeeDiscriminator,
  CustomerDiscriminator,
} from "./discriminators";
import { ROLE, RESOURCE } from "../../../constants";
import {
  UserModel,
  AdminModel,
  EmployeeModel,
  CustomerModel,
} from "../../../types";
import { ENV } from "../../../config";
import bcrypt from "bcrypt";

async function getAll() {
  return await model.find({ deleted: false });
}

async function getAllDeleted() {
  return await model.find({ deleted: true });
}

async function getById(_id: string) {
  return await model.findOne({ _id, deleted: false });
}

async function getEmail(email: string) {
  return await model
    .findOne({ email, deleted: false })
    .select(RESOURCE.PASSWORD);
}

async function add(body: UserModel, session: any) {
  const modelToUse =
    (body as AdminModel).roles === ROLE.ADMIN
      ? AdminDiscriminator
      : (body as EmployeeModel).roles === ROLE.EMPLOYEE
        ? EmployeeDiscriminator
        : (body as CustomerModel).roles === ROLE.CUSTOMER
          ? CustomerDiscriminator
          : model;

  return await (modelToUse as typeof model).create(body);
}

async function update(_id: string, body: UserModel, session: any) {
  return await model.findByIdAndUpdate(_id, body, {
    new: true,
    runValidators: true,
  });
}

async function deleteById(_id: string, session: any) {
  return await model.findByIdAndUpdate(_id, { deleted: true });
}

async function restoreById(_id: string, session: any) {
  return await model.findByIdAndUpdate(_id, { deleted: false });
}

async function forceDelete(_id: string, session: any) {
  return await model.findByIdAndDelete(_id);
}

async function changePassword(_id: string, newPassword: string, session: any) {
  return await model.findByIdAndUpdate(
    _id,
    { password: await bcrypt.hash(newPassword, ENV.SALT_NUMBER) },
    {
      new: true,
      runValidators: true,
      select: RESOURCE.PASSWORD,
      deleted: false,
      session,
    },
  );
}

async function getCode(verificationCode: string) {
  return await model.findOne({
    "verificationCode.code": verificationCode,
    deleted: false,
  });
}

async function sendEmailOTP(email: string, otp: string, session: any) {
  return await model.findByIdAndUpdate(
    (await model.findOne({ email }))?._id,
    { verificationCode: { code: otp, createdAt: new Date().toISOString() } },
    { new: true, runValidators: true, deleted: false, session },
  );
}

async function resetPassword(
  verificationCode: string,
  newPassword: string,
  session: any,
) {
  return await model
    .findByIdAndUpdate(
      (await model.findOne({ "verificationCode.code": verificationCode }))?._id,
      {
        verificationCode: null,
        password: await bcrypt.hash(newPassword, ENV.SALT_NUMBER),
      },
      { new: true, runValidators: true, deleted: false, session },
    )
    .select(RESOURCE.PASSWORD);
}

export default {
  getAll,
  getAllDeleted,
  getById,
  getEmail,
  add,
  update,
  deleteById,
  restoreById,
  forceDelete,
  changePassword,
  getCode,
  sendEmailOTP,
  resetPassword,
};
