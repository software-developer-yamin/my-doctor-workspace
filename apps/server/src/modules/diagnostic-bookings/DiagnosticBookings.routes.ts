import express from "express";
import { verifyAccessToken } from "../../middlewares/shared/jwt_helper.js";
import * as BookingController from "./DiagnosticBookings.controller.js";

const router: express.Router = express.Router();

// Customer APIs
router.post("/", verifyAccessToken, BookingController.CreateBooking);
router.get("/my-bookings", verifyAccessToken, BookingController.GetMyBookings);

// Admin APIs
router.get("/", verifyAccessToken, BookingController.GetAllBookings);
router.get("/:id", verifyAccessToken, BookingController.GetBookingById);
router.patch("/:id", verifyAccessToken, BookingController.UpdateBooking);
router.delete("/:id", verifyAccessToken, BookingController.DeleteBooking);

export default router;
