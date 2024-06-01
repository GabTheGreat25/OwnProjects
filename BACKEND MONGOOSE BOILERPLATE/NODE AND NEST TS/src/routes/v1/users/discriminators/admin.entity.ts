import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { User, UserSchema } from "../entities/user.entity";
import { ROLE } from "src/constants";

@Schema()
export class Admin extends User {}

export const AdminSchema = UserSchema.discriminator(
  ROLE.ADMIN,
  SchemaFactory.createForClass(Admin),
);
