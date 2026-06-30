import express from "express";
import { verifyAccessToken } from "../../middlewares/shared/jwt_helper.js";
import apiLimiter from "../../middlewares/shared/rate_limiter.js";
import * as UserController from "./Users.controller.js";

const router: express.Router = express.Router();

router.post("/register_user", apiLimiter, UserController.UserRegister);

router.post("/login", apiLimiter, UserController.UserLogin);
router.patch("/update_user/:id", verifyAccessToken, UserController.UserUpdate);

router.get("/get_one_user/:id", verifyAccessToken, UserController.GetOneUser);
router.get("/get_all_users", verifyAccessToken, UserController.GetAllUsers);
router.post("/logout", verifyAccessToken, UserController.Logout);

router.post("/refresh-token", UserController.RefreshToken);

router.delete(
  "/delete_user/:id",
  verifyAccessToken,
  UserController.DeleteOneUser
);

export default router;
