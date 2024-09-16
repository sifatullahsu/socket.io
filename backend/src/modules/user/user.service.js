import jwt from "jsonwebtoken";
import { User } from "./user.model.js";

const registration = async (data) => {
  const result = await User.create(data);
  const { password, ...userinfo } = result.toObject();

  return { data: userinfo };
};

const login = async (data) => {
  const result = await Model.findOne({ email: data.email }).select("+password");

  if (!result) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized access");
  }

  const isPasswordValid = await Model.checkPassword(
    data.password,
    result.password
  );

  if (!isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized access");
  }

  const { password, createdAt, updatedAt, ...userinfo } = result.toObject();

  const tokenData = { _id: userinfo._id, role: userinfo.role };
  const accessToken = jwt.sign(tokenData, "xyz", { expiresIn: expireTime });

  const payload = {
    ...userinfo,
    access_token: accessToken,
  };

  return { data: payload };
};

export const UserService = {
  registration,
  login,
};
