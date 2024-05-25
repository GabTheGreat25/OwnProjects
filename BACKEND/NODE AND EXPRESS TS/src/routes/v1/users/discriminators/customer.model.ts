import { Schema } from "mongoose";
import { RESOURCE, ROLE } from "../../../../constants/index";
import { CustomerModel } from "../../../../types/index";
import users from "../model";
import badWords from "bad-words";
import customBadWords from "../../../../utils/customBadWords";

const filter = new badWords();
filter.addWords(...customBadWords);

const schema = {
  discriminatorKey: RESOURCE.ROLES,
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
  schema
);

export default users.discriminator(ROLE.CUSTOMER, customerSchema);
