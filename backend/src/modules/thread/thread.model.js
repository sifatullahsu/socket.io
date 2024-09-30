import { model, Schema, Types } from "mongoose";

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
          deletedAt: { type: Date, default: null },
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
            id: { type: String },
            name: { type: String },
            size: { type: Number },
            type: { type: String },
            url: { type: String },
          },
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
      _id: false,
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

schema.statics.addParticipant = async (id, userId) => {
  return await Thread.updateOne(
    { _id: id, type: "group" },
    { $push: { participants: { user: userId } } }
  );
};

schema.statics.addAdmin = async (id, userId) => {
  return await Thread.updateOne(
    { _id: id, type: "group" },
    { $push: { "group.admins": userId } }
  );
};

schema.statics.removeParticipant = async (id, userId) => {
  return await Thread.updateOne(
    { _id: id, type: "group", "participants.user": { $in: [userId] } },
    { $set: { "participants.$[x].deletedAt": Date.now() } },
    { arrayFilters: [{ "x._id": userId }], new: true }
  );
};

schema.statics.removeAdmin = async (id, userId) => {
  return await Thread.updateOne(
    { _id: id, type: "group", "group.admins": { $in: [userId] } },
    { $pull: { "group.admins": userId } }
  );
};

schema.statics.updateLastSeen = async (id, userId) => {
  return await Thread.updateOne(
    { _id: id, participants: { $in: [userId] } },
    { $set: { "participants.$[x].lastSeen": Date.now() } },
    { arrayFilters: [{ "x._id": userId }], new: true }
  );
};

export const Thread = model("Thread", schema);
