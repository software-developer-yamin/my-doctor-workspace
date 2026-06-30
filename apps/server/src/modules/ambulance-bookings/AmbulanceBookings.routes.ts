import express from "express";
import { verifyAccessToken } from "../../middlewares/shared/jwt_helper.js";
import * as BookingController from "./AmbulanceBookings.controller.js";

const router: express.Router = express.Router();

// Customer App APIs
router.post("/", verifyAccessToken, BookingController.CreateBooking);
router.get("/my-bookings", verifyAccessToken, BookingController.GetMyBookings);

// Admin Panel APIs
router.get("/", verifyAccessToken, BookingController.GetAllBookings);
router.patch("/:id", verifyAccessToken, BookingController.UpdateBooking);
router.delete("/:id", verifyAccessToken, BookingController.DeleteBooking);

export default router;
