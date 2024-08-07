import mongoose from "mongoose";
import badWords from "bad-words";
import { RESOURCE } from "../../../constants";
import { TestChildModel } from "../../../types";
import { customBadWords } from "../../../utils";

const filter = new badWords();
filter.addWords(...customBadWords);

const schemaOptions = {
  timestamps: true,
};

const schema = new mongoose.Schema<TestChildModel>(
  {
    test: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: RESOURCE.TEST,
    },
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

export default mongoose.models[RESOURCE.TESTS_CHILD] ||
  mongoose.model(RESOURCE.TESTS_CHILD, schema);
