import mongoose from "mongoose";
import badWords from "bad-words";
import { RESOURCE } from "../../../constants";
import { customBadWords } from "../../../utils";
import { TestChildModel } from "../../../types";

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
      ref: RESOURCE.TESTS,
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
