import { Router } from "express";
import {
  getPatientHistories,
  createPatientHistory,
  updatePatientHistory,
  deletePatientHistory,
} from "../controllers/patientHistoryController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.route("/")
  .get(getPatientHistories)
  .post(createPatientHistory);

router.route("/:id")
  .put(updatePatientHistory)
  .delete(deletePatientHistory);

export default router;
