import mongoose from "mongoose";
import { RESOURCE } from "../../../constants/index.js";
import badWords from "bad-words";
import customBadWords from "../../../utils/customBadWords.js";

const filter = new badWords();
filter.addWords(...customBadWords);

const schemaOptions = {
  timestamps: true,
};

const schema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
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
  schemaOptions
);

export default mongoose.model(RESOURCE.TEST, schema);
