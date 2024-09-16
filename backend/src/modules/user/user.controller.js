import asyncHandler from "express-async-handler";
import { apiResponse } from "../../lib/utils.js";
import { UserService as service } from "./user.service.js";

const registration = asyncHandler(async (req, res) => {
  const { data } = await service.registration(req.body);

  apiResponse(res, {
    message: `${User.modelName} registration successfully.`,
    data,
  });
});

const login = asyncHandler(async (req, res) => {
  const { data } = await service.login(req.body);

  apiResponse(res, {
    message: `${User.modelName} login successfully.`,
    data,
  });
});

export const UserController = {
  registration,
  login,
};
