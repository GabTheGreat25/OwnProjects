import { Schema } from "mongoose";
import badWords from "bad-words";
import users from "../model";
import { RESOURCE, ROLE } from "../../../../constants";
import { CustomerModel } from "../../../../types";
import { customBadWords } from "../../../../utils";

const filter = new badWords();
filter.addWords(...customBadWords);

const schemaOptions = {
  discriminatorKey: RESOURCE.ROLE,
};

const customerSchema = new Schema<CustomerModel>(
  {
    details: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          return !filter.isProfane(value);
        },
        message: "Comments cannot contain profanity.",
      },
    },
  },
  schemaOptions,
);

export const CustomerDiscriminator = users.discriminator(
  ROLE.CUSTOMER,
  customerSchema,
);
