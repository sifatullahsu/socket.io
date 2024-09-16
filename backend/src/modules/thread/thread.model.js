import { model, Schema } from "mongoose";

const schema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["single", "group"],
      immutable: true,
    },
    participants: {
      type: [
        {
          user: { type: Types.ObjectId, required: true, ref: "User" },
          lastSeen: { type: Date, default: Date.now(), required: true },
        },
      ],
      validate: {
        validator: function (value) {
          return !(this.type === "single" && value.length !== 2);
        },
        message: "For type 'single', participants length must be exactly 2.",
      },
    },
    group: {
      type: {
        name: { type: String, required: true },
        image: {
          type: {
            id: { type: String, required: true },
            name: { type: String, required: true },
            size: { type: Number, required: true },
            type: { type: String, required: true },
            url: { type: String, required: true },
          },
          default: null,
        },
        admins: {
          type: [{ type: Types.ObjectId, required: true, ref: "User" }],
          validate: {
            validator: function (value) {
              if (this.type === "group" && this.group) {
                const participantIds = this.participants.map((p) =>
                  p.user.toString()
                );
                return this.group.admins.every((adminId) =>
                  participantIds.includes(adminId.toString())
                );
              }
              return true;
            },
            message: "Each admin in the group must also be a participant.",
          },
        },
      },
      validate: {
        validator: function (value) {
          return !(this.type === "single" && value !== null);
        },
        message: "`group` must be null when type is 'single'.",
      },
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schema.virtual("messages", {
  localField: "_id",
  foreignField: "conversation",
  ref: "Message",
  skip: 0,
  perDocumentLimit: 50,
});

export const Thread = model("Thread", schema);
