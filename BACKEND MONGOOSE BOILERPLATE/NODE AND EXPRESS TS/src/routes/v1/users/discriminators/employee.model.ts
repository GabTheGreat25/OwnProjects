import { Schema } from "mongoose";
import users from "../model";
import { RESOURCE, ROLE } from "../../../../constants";
import { EmployeeModel } from "../../../../types";

const schemaOptions = {
  discriminatorKey: RESOURCE.ROLE,
};

const employeeSchema = new Schema<EmployeeModel>({}, schemaOptions);

export const EmployeeDiscriminator = users.discriminator(
  ROLE.EMPLOYEE,
  employeeSchema,
);
