import { Schema } from "mongoose";
import users from "../model";
import { RESOURCE, ROLE } from "../../../../constants";
import { AdminModel } from "../../../../types";

const schemaOptions = {
  discriminatorKey: RESOURCE.ROLE,
};

const adminSchema = new Schema<AdminModel>({}, schemaOptions);

export const AdminDiscriminator =
  users?.discriminators?.[ROLE.ADMIN] ||
  users.discriminator(ROLE.ADMIN, adminSchema);
