import express from "express";
import upload from "../../helpers/upload.helper.js";
import { verifyAccessToken } from "../../middlewares/shared/jwt_helper.js";
import { protect } from "../../middlewares/shared/protect.js";
import { validate } from "../../validators/validate.middleware.js";
import { createDoctorSchema, updateDoctorSchema, doctorLoginSchema } from "../../validators/doctor.validator.js";
import * as DoctorController from "./Doctors.controller.js";

const router: express.Router = express.Router();

// validate after upload so multer populates req.body first
router.post("/login", validate(doctorLoginSchema), DoctorController.Login);
router.get("/public", DoctorController.GetAllDoctors);
router.get("/filters", DoctorController.GetDoctorFilters);
router.post("/", verifyAccessToken, upload.single('photo'), validate(createDoctorSchema), DoctorController.CreateDoctor);

router.get("/me", verifyAccessToken, protect(["doctor"]), DoctorController.GetMe);
router.get("/", verifyAccessToken, DoctorController.GetAllDoctors);
router.get("/:id", DoctorController.GetDoctorById);
router.get("/:id/hospitals", verifyAccessToken, DoctorController.GetDoctorHospitals);
router.get("/:id/available-slots", DoctorController.GetDoctorAvailableSlots);
router.get("/:id/related", DoctorController.GetRelatedDoctors);
router.get("/:id/reviews", DoctorController.GetDoctorReviews);
router.post("/:id/reviews", DoctorController.CreateDoctorReview);
router.patch("/:id/reviews/:reviewId", verifyAccessToken, DoctorController.UpdateDoctorReview);
router.delete("/:id/reviews/:reviewId", verifyAccessToken, DoctorController.DeleteDoctorReview);
router.patch("/:id", verifyAccessToken, upload.single('photo'), validate(updateDoctorSchema), DoctorController.UpdateDoctor);
router.delete("/:id", verifyAccessToken, DoctorController.DeleteDoctor);

export default router;
