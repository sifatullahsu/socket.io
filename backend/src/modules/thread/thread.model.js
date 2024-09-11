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
          user: {
            type: Types.ObjectId,
            required: true,
            ref: "User",
          },
          isAdmin: {
            type: Boolean,
            required: true,
          },
          lastSeen: {
            type: Date,
            default: Date.now(),
            required: true,
          },
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
        name: {
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
          },
          default: null,
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
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
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
