import { Schema, model } from "mongoose";
import badWords from "bad-words";
import { RESOURCE } from "../../../constants/index.js";
import { customBadWords } from "../../../utils/index.js";
import { TestModel } from "../../../types";

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
        message: "Description contains inappropriate language.",
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

export default model(RESOURCE.TESTS, schema);
