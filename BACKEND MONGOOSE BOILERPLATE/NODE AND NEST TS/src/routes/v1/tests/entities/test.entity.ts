import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { filterBadWords } from "src/utils";
import { Document } from "mongoose";
import { UploadImages } from "src/types";

@Schema({ timestamps: true })
export class Test extends Document {
  @Prop({
    required: true,
    validate: {
      validator: function (value: string) {
        return filterBadWords(value);
      },
      message: "Description contains inappropriate language.",
    },
  })
  message: string;

  @Prop({
    required: true,
  })
  image: UploadImages[];

  @Prop({ default: false })
  deleted: boolean;
}

export const TestSchema = SchemaFactory.createForClass(Test);
