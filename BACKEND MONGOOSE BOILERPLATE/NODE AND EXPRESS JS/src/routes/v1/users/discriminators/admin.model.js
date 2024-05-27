import { Schema } from "mongoose";
import { RESOURCE, ROLE } from "../../../../constants/index.js";
import users from "../model.js";

const schema = {
  discriminatorKey: RESOURCE.ROLES,
};

const adminSchema = new Schema({}, schema);

export default users.discriminator(ROLE.ADMIN, adminSchema);
