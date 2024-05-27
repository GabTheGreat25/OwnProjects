import { Schema, model } from "mongoose";
import { RESOURCE } from "../../../constants/index";
import badWords from "bad-words";
import customBadWords from "../../../utils/customBadWords";
import { TestModel } from "../../../types/index";

const filter = new badWords();
filter.addWords(...customBadWords);

const schemaOptions = {
  timestamps: true,
};

const schema = new Schema<TestModel>(
  {
    message: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          return !filter.isProfane(value);
        },
        message: "Comments cannot contain profanity.",
      },
    },
    image: [
      {
        public_id: String,
        url: String,
        originalname: String,
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  schemaOptions,
);

export default model(RESOURCE.TEST, schema);
