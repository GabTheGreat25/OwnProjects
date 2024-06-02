import { Schema } from "mongoose";
import users from "../model";
import { RESOURCE, ROLE } from "../../../../constants";
import { EmployeeModel } from "../../../../types";

const schema = {
  discriminatorKey: RESOURCE.ROLES,
};

const employeeSchema = new Schema<EmployeeModel>({}, schema);

export const EmployeeDiscriminator = users.discriminator(
  ROLE.EMPLOYEE,
  employeeSchema,
);
