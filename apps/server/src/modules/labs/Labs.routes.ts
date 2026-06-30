import express from "express";
import { verifyAccessToken } from "../../middlewares/shared/jwt_helper.js";
import upload from "../../helpers/upload.helper.js";
import * as LabController from "./Labs.controller.js";

const router: express.Router = express.Router();

const cpUpload = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'cover_photo', maxCount: 1 },
]);

// Public routes — order matters: /public/filters must come before /public/:id
router.get("/public/filters", LabController.GetLabFilters);
router.get("/public", LabController.GetAllLabs);
router.get("/public/:id", LabController.GetLabById);

// Authenticated routes
router.post("/", verifyAccessToken, cpUpload, LabController.CreateLab);
router.get("/", verifyAccessToken, LabController.GetAllLabs);
router.get("/filters", verifyAccessToken, LabController.GetLabFilters);
router.get("/:id", verifyAccessToken, LabController.GetLabById);
router.patch("/:id", verifyAccessToken, cpUpload, LabController.UpdateLab);
router.delete("/:id", verifyAccessToken, LabController.DeleteLab);

export default router;
