import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { User, UserSchema } from "../entities/user.entity";
import { ROLE } from "src/constants";
import { filterBadWords } from "src/utils";

@Schema()
export class Customer extends User {
  @Prop({
    required: true,
    validate: {
      validator: function (value: string) {
        return filterBadWords(value);
      },
      message: "Description contains inappropriate language.",
    },
  })
  description: string;
}

export const CustomerSchema = UserSchema.discriminator(
  ROLE.CUSTOMER,
  SchemaFactory.createForClass(Customer),
);
