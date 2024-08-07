import mongoose from "mongoose";
import { Schema, model } from "mongoose";
import { RESOURCE } from "../../../constants";
import { UserModel } from "../../../types";

const schemaOptions = {
  discriminatorKey: RESOURCE.ROLE,
  timestamps: true,
};

const schema = new mongoose.Schema<UserModel>(
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
    verificationCode: {
      code: {
        type: String,
        default: null,
      },
      createdAt: {
        type: Date,
        default: null,
      },
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  schemaOptions,
);

export default mongoose.models[RESOURCE.USERS] ||
  mongoose.model(RESOURCE.USERS, schema);
