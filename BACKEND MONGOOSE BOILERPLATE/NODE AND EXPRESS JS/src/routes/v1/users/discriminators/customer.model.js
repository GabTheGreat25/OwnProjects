import { Schema } from "mongoose";
import badWords from "bad-words";
import users from "../model.js";
import { customBadWords } from "../../../../utils/index.js";
import { RESOURCE, ROLE } from "../../../../constants/index.js";

const filter = new badWords();
filter.addWords(...customBadWords);

const schemaOptions = {
  discriminatorKey: RESOURCE.ROLE,
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
        message: "Description contains inappropriate language.",
      },
    },
  },
  schemaOptions,
);

export const CustomerDiscriminator = users.discriminator(
  ROLE.CUSTOMER,
  customerSchema,
);
