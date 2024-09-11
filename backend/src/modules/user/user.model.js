import { model, Schema } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: {
        name: {
          type: String,
          required: true,
        },
        size: {
          type: Number,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        id: {
          type: String,
          required: true,
        },
      },
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

export const User = model("User", schema);
