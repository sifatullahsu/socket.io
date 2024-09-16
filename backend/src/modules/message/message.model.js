import { model, Schema, Types } from "mongoose";

const schema = new Schema(
  {
    conversation: { type: Types.ObjectId, required: true, ref: "Thread" },
    sender: { type: Types.ObjectId, required: true, ref: "User" },
    reply: { type: Types.ObjectId, ref: "Message", default: null },
    message: { type: String, default: "" },
    files: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        size: { type: Number, required: true },
        type: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    removed: {
      soft: [{ type: Types.ObjectId, required: true, ref: "User" }],
      hard: { type: Boolean, default: false, required: true },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Message = model("Message", schema);
