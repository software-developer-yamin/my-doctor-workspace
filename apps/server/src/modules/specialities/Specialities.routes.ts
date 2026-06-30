import express from "express";
import { verifyAccessToken } from "../../middlewares/shared/jwt_helper.js";
import upload from "../../helpers/upload.helper.js";
import * as SpecialityController from "./Specialities.controller.js";

const router: express.Router = express.Router();

router.get("/public", SpecialityController.GetAllSpecialities);
router.post("/", verifyAccessToken, upload.single('image'), SpecialityController.CreateSpeciality);
router.get("/", verifyAccessToken, SpecialityController.GetAllSpecialities);
router.patch("/:id", verifyAccessToken, upload.single('image'), SpecialityController.UpdateSpeciality);
router.delete("/:id", verifyAccessToken, SpecialityController.DeleteSpeciality);

export default router;
