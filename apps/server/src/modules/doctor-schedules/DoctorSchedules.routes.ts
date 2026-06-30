import express from "express";
import { verifyAccessToken } from "../../middlewares/shared/jwt_helper.js";
import * as DoctorScheduleController from "./DoctorSchedules.controller.js";

const router: express.Router = express.Router();

router.post("/", verifyAccessToken, DoctorScheduleController.CreateSchedule);
router.get("/filter-options", DoctorScheduleController.GetFilterOptions);
router.get("/", DoctorScheduleController.GetAllSchedules);
router.get("/doctor/:doctorId", DoctorScheduleController.GetByDoctorId);
router.patch("/:id", verifyAccessToken, DoctorScheduleController.UpdateSchedule);
router.delete("/:id", verifyAccessToken, DoctorScheduleController.DeleteSchedule);


export default router;
