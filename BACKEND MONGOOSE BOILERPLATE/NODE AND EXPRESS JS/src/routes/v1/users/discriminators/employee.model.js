import { Schema } from "mongoose";
import users from "../model.js";
import { RESOURCE, ROLE } from "../../../../constants/index.js";

const schemaOptions = {
  discriminatorKey: RESOURCE.ROLE,
};

const employeeSchema = new Schema({}, schemaOptions);

export const EmployeeDiscriminator =
  users?.discriminators?.[ROLE.EMPLOYEE] ||
  users.discriminator(ROLE.EMPLOYEE, employeeSchema);
