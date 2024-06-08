import { Schema } from "mongoose";
import users from "../model.js";
import { RESOURCE, ROLE } from "../../../../constants/index.js";

const schemaOptions = {
  discriminatorKey: RESOURCE.ROLE,
};

const employeeSchema = new Schema({}, schemaOptions);

export const EmployeeDiscriminator = users.discriminator(
  ROLE.EMPLOYEE,
  employeeSchema,
);
