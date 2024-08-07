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
    description: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          return !filter.isProfane(value);
        },
        message: "Description contains inappropriate language.",
      },
    },
  },
  schemaOptions,
);

export const CustomerDiscriminator =
  users?.discriminators?.[ROLE.CUSTOMER] ||
  users.discriminator(ROLE.CUSTOMER, customerSchema);
