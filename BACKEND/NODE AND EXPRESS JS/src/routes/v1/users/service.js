import model from "./model.js";
import adminModel from "./discriminators/admin.model.js";
import employeeModel from "./discriminators/employee.model.js";
import customerModel from "./discriminators/customer.model.js";
import { ROLE } from "../../../constants/index.js";

const getAll = async () => {
  return await model.find({ deleted: false });
};

const getAllDeleted = async () => {
  return await model.find({ deleted: true });
};

const getById = async (_id) => {
  return await model.findOne({ _id, deleted: false });
};

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

const update = async (_id, body) => {
  return await model.findOneAndUpdate({ _id }, body);
};

const deleteById = async (_id) => {
  return await model.findOneAndUpdate({ _id }, { deleted: true });
};

const restoreById = async (_id) => {
  return await model.findOneAndUpdate(
    { _id },
    { deleted: false },
    { new: true }
  );
};

const forceDelete = async (_id) => {
  return await model.findOneAndDelete({ _id });
};

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
