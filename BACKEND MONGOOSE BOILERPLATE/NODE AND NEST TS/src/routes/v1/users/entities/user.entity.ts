import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as bcrypt from "bcrypt";
import { RESOURCE } from "src/constants";
import { UploadImages } from "src/types";
import { ENV } from "src/config";

@Schema({ timestamps: true, discriminatorKey: RESOURCE.ROLE })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({
    required: true,
    select: false,
    minlength: 6,
    set: (value: string) =>
      bcrypt.hashSync(value, bcrypt.genSaltSync(ENV.SALT_NUMBER)),
  })
  password: string;

  @Prop({
    required: true,
  })
  image: UploadImages[];

  @Prop({ default: false })
  deleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
