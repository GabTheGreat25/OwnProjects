import { Schema } from "mongoose";
import users from "../model.js";
import { RESOURCE, ROLE } from "../../../../constants/index.js";

const schemaOptions = {
  discriminatorKey: RESOURCE.ROLE,
};

const adminSchema = new Schema({}, schemaOptions);

export const AdminDiscriminator =
  users?.discriminators?.[ROLE.ADMIN] ||
  users.discriminator(ROLE.ADMIN, adminSchema);
