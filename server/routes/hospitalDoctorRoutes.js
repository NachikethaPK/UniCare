import { Router } from "express";
import {
  getHospitalDoctors,
  createHospitalDoctor,
  updateHospitalDoctor,
  deleteHospitalDoctor,
} from "../controllers/hospitalDoctorController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.route("/")
  .get(getHospitalDoctors)
  .post(createHospitalDoctor);

router.route("/:id")
  .put(updateHospitalDoctor)
  .delete(deleteHospitalDoctor);

export default router;
