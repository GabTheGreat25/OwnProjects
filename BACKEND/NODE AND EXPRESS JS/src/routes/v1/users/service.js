import model from "./model.js";
import adminModel from "./discriminators/admin.model.js";
import employeeModel from "./discriminators/employee.model.js";
import customerModel from "./discriminators/customer.model.js";
import { ROLE } from "../../../constants/index.js";

async function getAll() {
  return await model.find({ deleted: false }).select("+password");
}

async function getAllDeleted() {
  return await model.find({ deleted: true });
}

async function getById(_id) {
  return await model.findOne({ _id, deleted: false });
}

async function add(body) {
  return await (body.roles === ROLE.ADMIN
    ? adminModel
    : body.roles === ROLE.EMPLOYEE
    ? employeeModel
    : body.roles === ROLE.CUSTOMER
    ? customerModel
    : model
  ).create([body]);
}

async function update(_id, body) {
  return await model.findOneAndUpdate({ _id }, body);
}

async function deleteById(_id) {
  return await model.findOneAndUpdate({ _id }, { deleted: true });
}

async function restoreById(_id) {
  return await model.findOneAndUpdate(
    { _id },
    { deleted: false },
    { new: true }
  );
}

async function forceDelete(_id) {
  return await model.findOneAndDelete({ _id });
}

export default {
  getAll,
  getAllDeleted,
  getById,
  add,
  update,
  deleteById,
  restoreById,
  forceDelete,
};
