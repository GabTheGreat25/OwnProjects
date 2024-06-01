import { SchemaFactory } from "@nestjs/mongoose";
import { User, UserSchema } from "../entities/user.entity";
import { ROLE } from "src/constants";

export class Employee extends User {}

export const EmployeeSchema = UserSchema.discriminator(
  ROLE.EMPLOYEE,
  SchemaFactory.createForClass(Employee),
);
