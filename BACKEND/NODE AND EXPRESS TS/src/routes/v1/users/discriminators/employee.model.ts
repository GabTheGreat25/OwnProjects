import { Schema } from "mongoose";
import { RESOURCE, ROLE } from "../../../../constants/index";
import { EmployeeModel } from "../../../../types/index";
import users from "../model";

const schema = {
  discriminatorKey: RESOURCE.ROLES,
};

const employeeSchema = new Schema<EmployeeModel>({}, schema);

export default users.discriminator(ROLE.EMPLOYEE, employeeSchema);
