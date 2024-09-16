import { Router } from "express";
import { UserController as controller } from "./user.controller.js";

const router = Router();

router.post("/registration", controller.registration);
router.post("/login", controller.login);

export const UserRoute = router;
