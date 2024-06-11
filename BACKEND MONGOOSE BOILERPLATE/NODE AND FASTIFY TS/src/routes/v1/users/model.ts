import { Schema, model } from "mongoose";
import { RESOURCE } from "../../../constants";
import { UserModel } from "../../../types";

const schemaOptions = {
  discriminatorKey: RESOURCE.ROLE,
  timestamps: true,
};

const schema = new Schema<UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    image: [
      {
        public_id: String,
        url: String,
        originalname: String,
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  schemaOptions,
);

export default model(RESOURCE.USERS, schema);
