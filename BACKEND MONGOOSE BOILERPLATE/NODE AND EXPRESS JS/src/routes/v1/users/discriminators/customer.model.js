import { Schema } from "mongoose";
import { RESOURCE, ROLE } from "../../../../constants/index.js";
import users from "../model.js";
import badWords from "bad-words";
import customBadWords from "../../../../utils/customBadWords.js";

const filter = new badWords();
filter.addWords(...customBadWords);

const schema = {
  discriminatorKey: RESOURCE.ROLES,
};

const customerSchema = new Schema(
  {
    details: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return !filter.isProfane(value);
        },
        message: "Comments cannot contain profanity.",
      },
    },
  },
  schema
);

export default users.discriminator(ROLE.CUSTOMER, customerSchema);
