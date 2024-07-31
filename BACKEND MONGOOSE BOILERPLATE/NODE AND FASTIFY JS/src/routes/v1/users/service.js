import model from "./model.js";
import {
  AdminDiscriminator,
  EmployeeDiscriminator,
  CustomerDiscriminator,
} from "./discriminators/index.js";
import { ROLE, RESOURCE } from "../../../constants/index.js";
import { ENV } from "../../../config/index.js";
import bcrypt from "bcrypt";

async function getAll() {
  return await model.find({ deleted: false });
}

async function getAllDeleted() {
  return await model.find({ deleted: true });
}

async function getById(_id) {
  return await model.findOne({ _id, deleted: false });
}

async function getEmail(email) {
  return await model
    .findOne({ email, deleted: false })
    .select(RESOURCE.PASSWORD);
}

async function add(body, session) {
  return await (
    body.roles === ROLE.ADMIN
      ? AdminDiscriminator
      : body.roles === ROLE.EMPLOYEE
        ? EmployeeDiscriminator
        : body.roles === ROLE.CUSTOMER
          ? CustomerDiscriminator
          : model
  ).create([body], { session });
}

async function update(_id, body, session) {
  return await model.findByIdAndUpdate(_id, body, {
    new: true,
    runValidators: true,
    session,
  });
}

async function deleteById(_id, session) {
  return await model.findByIdAndUpdate(_id, { deleted: true }, { session });
}

async function restoreById(_id, session) {
  return await model.findByIdAndUpdate(_id, { deleted: false }, { session });
}

async function forceDelete(_id, session) {
  return await model.findByIdAndDelete(_id, { session });
}

async function changePassword(_id, newPassword, session) {
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

async function getCode(verificationCode) {
  return await model.findOne({
    "verificationCode.code": verificationCode,
    deleted: false,
  });
}

async function sendEmailOTP(email, otp, session) {
  return await model.findByIdAndUpdate(
    (await model.findOne({ email }))._id,
    { verificationCode: { code: otp, createdAt: new Date() } },
    { new: true, runValidators: true, deleted: false, session },
  );
}

async function resetPassword(verificationCode, newPassword, session) {
  return await model
    .findByIdAndUpdate(
      (await model.findOne({ "verificationCode.code": verificationCode }))._id,
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
