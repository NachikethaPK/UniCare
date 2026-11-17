import { Router } from "express";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getDoctorSchedule,
} from "../controllers/appointmentController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/doctor/schedule", getDoctorSchedule);

router.route("/")
  .get(getAppointments)
  .post(createAppointment);

router.route("/:id")
  .put(updateAppointment)
  .delete(deleteAppointment);

export default router;
