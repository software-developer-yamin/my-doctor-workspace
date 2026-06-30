import express from "express";
import upload from "../../helpers/upload.helper.js";
import { verifyAccessToken } from "../../middlewares/shared/jwt_helper.js";
import * as TestController from "./DiagnosticTests.controller.js";

const router: express.Router = express.Router();

// /public/filters must be before /public/:id to avoid route collision
router.get("/public/filters", TestController.GetTestFilters);
router.get("/public", TestController.GetAllTests);
router.get("/public/:id", TestController.GetTestById);

router.post("/", verifyAccessToken, upload.single('image'), TestController.CreateTest);
router.get("/", verifyAccessToken, TestController.GetAllTests);
router.get("/:id", verifyAccessToken, TestController.GetTestById);
router.patch("/:id", verifyAccessToken, upload.single('image'), TestController.UpdateTest);
router.delete("/:id", verifyAccessToken, TestController.DeleteTest);

export default router;
