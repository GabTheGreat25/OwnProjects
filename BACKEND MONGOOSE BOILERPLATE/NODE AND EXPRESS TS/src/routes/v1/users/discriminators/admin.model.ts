import { Schema } from "mongoose";
import { RESOURCE, ROLE } from "../../../../constants/index";
import { AdminModel } from "../../../../types/index";
import users from "../model";

const schema = {
  discriminatorKey: RESOURCE.ROLES,
};

const adminSchema = new Schema<AdminModel>({}, schema);

export default users.discriminator(ROLE.ADMIN, adminSchema);
