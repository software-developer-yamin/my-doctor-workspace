import express from "express";
import HealthRoutes from "../modules/health/Health.routes.js";
import UserRoutes from "../modules/users/Users.routes.js";
import AnalyticsRoutes from "../modules/users/Analytics.routes.js";
import SpecialityRoutes from "../modules/specialities/Specialities.routes.js";
import BdLocationRoutes from "../modules/bd-locations/BdLocations.routes.js";
import DoctorRoutes from "../modules/doctors/Doctors.routes.js";
import ConcentrationRoutes from "../modules/concentrations/Concentrations.routes.js";
import HospitalRoutes from "../modules/hospitals/Hospitals.routes.js";
import DoctorScheduleRoutes from "../modules/doctor-schedules/DoctorSchedules.routes.js";
import CustomerRoutes from "../modules/customers/Customers.routes.js";
import AppointmentRoutes from "../modules/appointments/Appointments.routes.js";
import GuideRoutes from "../modules/guides/Guides.routes.js";
import GuideBookingRoutes from "../modules/guide-bookings/GuideBookings.routes.js";
import DoctorHomeScheduleRoutes from "../modules/doctor-home-schedules/DoctorHomeSchedules.routes.js";
import HomeDoctorBookingRoutes from "../modules/home-doctor-bookings/HomeDoctorBookings.routes.js";
import DoctorLiveQueueRoutes from "../modules/doctor-live-queues/DoctorLiveQueues.routes.js";
import AmbulanceRoutes from "../modules/ambulances/Ambulances.routes.js";
import AmbulanceBookingRoutes from "../modules/ambulance-bookings/AmbulanceBookings.routes.js";
import DiagnosticTestRoutes from "../modules/diagnostic-tests/DiagnosticTests.routes.js";
import LabRoutes from "../modules/labs/Labs.routes.js";
import DiagnosticBookingRoutes from "../modules/diagnostic-bookings/DiagnosticBookings.routes.js";
import SmsLogRoutes from "../modules/sms-logs/SmsLogs.routes.js";
import ContactMessageRoutes from "../modules/contact-messages/ContactMessages.routes.js";
import CallbackRequestRoutes from "../modules/callback-requests/CallbackRequests.routes.js";
import PrescriptionRoutes from "../modules/prescriptions/Prescriptions.routes.js";
import DoctorReviewRoutes from "../modules/doctor-reviews/DoctorReviews.routes.js";
import AIRoutes from "../modules/ai/AI.routes.js";


const router: express.Router = express.Router();

// Health check — Docker healthcheck + monitoring
router.use("/health", HealthRoutes);

// Auth
router.use("/auth", UserRoutes);

// Analytics (admin dashboard stats)
router.use("/analytics", AnalyticsRoutes);

// Utils
router.use("/specialities", SpecialityRoutes);
router.use("/bd-locations", BdLocationRoutes);
router.use("/concentrations", ConcentrationRoutes);

// Doctors
router.use("/doctors", DoctorRoutes);

// Hospitals
router.use("/hospitals", HospitalRoutes);

// Ambulances
router.use("/ambulances", AmbulanceRoutes);
router.use("/ambulance-bookings", AmbulanceBookingRoutes);
router.use("/diagnostic-tests", DiagnosticTestRoutes);
router.use("/labs", LabRoutes);
router.use("/diagnostic-bookings", DiagnosticBookingRoutes);

// Doctor Schedules
router.use("/doctor-schedules", DoctorScheduleRoutes);

// Customers
router.use("/customers", CustomerRoutes);

// Appointments
router.use("/appointments", AppointmentRoutes);

// Guides
router.use("/guides", GuideRoutes);

// Guide Bookings
router.use("/guide-bookings", GuideBookingRoutes);

// Doctor Home Schedules
router.use("/doctor-home-schedules", DoctorHomeScheduleRoutes);

// Home Doctor Bookings
router.use("/home-doctor-bookings", HomeDoctorBookingRoutes);

// Doctor Live Queues (Realtime Serial Tracking)
router.use("/doctor-live-queues", DoctorLiveQueueRoutes);

// SMS Logs (history + send app download link)
router.use("/sms-logs", SmsLogRoutes);

// Contact form messages
router.use("/contact-messages", ContactMessageRoutes);

// Callback requests (Call Me Back)
router.use("/callback-requests", CallbackRequestRoutes);

// Prescriptions
router.use("/prescriptions", PrescriptionRoutes);

// Doctor Reviews
router.use("/doctor-reviews", DoctorReviewRoutes);

// AI features (doctor recommendation, symptom triage, conversational AI, web search)
router.use("/ai", AIRoutes);


export default router;


