import { Schema, model } from "mongoose";
import badWords from "bad-words";
import { RESOURCE } from "../../../constants/index.js";
import { customBadWords } from "../../../utils/index.js";

const filter = new badWords();
filter.addWords(...customBadWords);

const schemaOptions = {
  timestamps: true,
};

const schema = new Schema(
  {
    test: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: RESOURCE.TEST,
    },
    message: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
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

export default model(RESOURCE.TESTS_CHILD, schema);
