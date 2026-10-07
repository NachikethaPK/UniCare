import { Router } from "express";
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from "../controllers/appointmentController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.route("/")
  .get(getAppointments)
  .post(createAppointment);

router.route("/:id")
  .put(updateAppointment)
  .delete(deleteAppointment);

export default router;
