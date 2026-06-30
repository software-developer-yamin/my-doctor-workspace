import express from "express";
import upload from "../../helpers/upload.helper.js";
import { verifyAccessToken } from "../../middlewares/shared/jwt_helper.js";
import * as AmbulanceController from "./Ambulances.controller.js";

const router: express.Router = express.Router();

router.get("/filters", AmbulanceController.GetAmbulanceFilters);
router.get("/public", AmbulanceController.GetAllAmbulances);

router.post("/", verifyAccessToken, upload.single('image'), AmbulanceController.CreateAmbulance);
router.get("/", verifyAccessToken, AmbulanceController.GetAllAmbulances);
router.get("/:id", verifyAccessToken, AmbulanceController.GetAmbulanceById);
router.patch("/:id", verifyAccessToken, upload.single('image'), AmbulanceController.UpdateAmbulance);
router.delete("/:id", verifyAccessToken, AmbulanceController.DeleteAmbulance);

export default router;
