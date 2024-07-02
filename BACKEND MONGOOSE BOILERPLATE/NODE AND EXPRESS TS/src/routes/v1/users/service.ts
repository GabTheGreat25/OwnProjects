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

  return await (modelToUse as typeof model).create([body], { session });
}

async function update(_id: string, body: UserModel, session: any) {
  return await model.findByIdAndUpdate(_id, body, {
    new: true,
    runValidators: true,
    session,
  });
}

async function deleteById(_id: string, session: any) {
  return await model.findByIdAndUpdate(_id, { deleted: true }, { session });
}

async function restoreById(_id: string, session: any) {
  return await model.findByIdAndUpdate(_id, { deleted: false }, { session });
}

async function forceDelete(_id: string, session: any) {
  return await model.findByIdAndDelete(_id, { session });
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
};
