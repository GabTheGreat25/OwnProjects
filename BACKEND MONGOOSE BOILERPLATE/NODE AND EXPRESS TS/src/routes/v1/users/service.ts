import model from "./model";
import adminDiscriminator from "./discriminators/admin.model";
import employeeDiscrimantor from "./discriminators/employee.model";
import customerDiscrimantor from "./discriminators/customer.model";
import { ROLE } from "../../../constants/index";
import {
  UserModel,
  AdminModel,
  EmployeeModel,
  CustomerModel,
} from "../../../types/index";

async function getAll(_filter: any = {}) {
  return await model.find({ deleted: false }).select("+password");
}

async function getAllDeleted() {
  return await model.find({ deleted: true });
}

async function getById(_id: string) {
  return await model.findOne({ _id, deleted: false });
}

async function getImageById(_id: string) {
  return await model.findOne({ _id, deleted: false }).select("image");
}

async function add(body: UserModel) {
  const modelToUse =
    (body as AdminModel).roles === ROLE.ADMIN
      ? adminDiscriminator
      : (body as EmployeeModel).roles === ROLE.EMPLOYEE
        ? employeeDiscrimantor
        : (body as CustomerModel).roles === ROLE.CUSTOMER
          ? customerDiscrimantor
          : model;

  return await (modelToUse as typeof model).create(body);
}

async function update(_id: string, body: UserModel) {
  return await model.findOneAndUpdate({ _id }, body, { new: true });
}

async function deleteById(_id: string) {
  return await model.findOneAndUpdate({ _id }, { deleted: true });
}

async function restoreById(_id: string) {
  return await model.findOneAndUpdate({ _id }, { deleted: false });
}

async function forceDelete(_id: string) {
  return await model.findOneAndDelete({ _id });
}

export default {
  getAll,
  getAllDeleted,
  getById,
  getImageById,
  add,
  update,
  deleteById,
  restoreById,
  forceDelete,
};
