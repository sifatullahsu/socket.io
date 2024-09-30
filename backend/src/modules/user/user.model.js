import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";

const schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    image: {
      type: {
        id: { type: String },
        name: { type: String },
        size: { type: Number },
        type: { type: String },
        url: { type: String },
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schema.statics.hashGenerator = async (password) => {
  return await bcrypt.hash(password, 10);
};

schema.pre("save", async function () {
  this.password = await User.hashGenerator(this.password);
});

schema.pre("updateOne", async function () {
  const user = this.getUpdate();

  if (user?.password) {
    user.password = await User.hashGenerator(user.password);
  }
});

export const User = model("User", schema);
