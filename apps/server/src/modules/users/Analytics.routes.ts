import express from "express";
import { verifyAccessToken } from "../../middlewares/shared/jwt_helper.js";
import { GetDashboardStats } from "./Analytics.controller.js";

const router: express.Router = express.Router();

router.get("/dashboard", verifyAccessToken, GetDashboardStats);

export default router;
