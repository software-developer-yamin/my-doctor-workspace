import express from "express";
import upload from "../../helpers/upload.helper.js";
import { verifyAccessToken } from "../../middlewares/shared/jwt_helper.js";
import * as HospitalController from "./Hospitals.controller.js";

const router: express.Router = express.Router();

const cpUpload = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'cover_photo', maxCount: 1 }
]);

router.get("/filters", HospitalController.GetHospitalFilters);
router.get("/public", HospitalController.GetAllHospitals);
router.post("/", verifyAccessToken, cpUpload, HospitalController.CreateHospital);
router.get("/", verifyAccessToken, HospitalController.GetAllHospitals);

router.get("/:id/reviews", HospitalController.GetHospitalReviews);
router.post("/:id/reviews", HospitalController.CreateHospitalReview);
router.get("/:id", HospitalController.GetHospitalById);
router.patch("/:id", verifyAccessToken, cpUpload, HospitalController.UpdateHospital);
router.delete("/:id", verifyAccessToken, HospitalController.DeleteHospital);

export default router;
