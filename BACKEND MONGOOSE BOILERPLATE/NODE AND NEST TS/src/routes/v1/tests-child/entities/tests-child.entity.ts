import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { filterBadWords } from "src/utils";
import { Document, Schema as MongooseSchema } from "mongoose";
import { UploadImages } from "src/types";

@Schema({ timestamps: true })
export class TestsChild extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Test", required: true })
  test: MongooseSchema.Types.ObjectId;

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

export const TestsChildSchema = SchemaFactory.createForClass(TestsChild);
