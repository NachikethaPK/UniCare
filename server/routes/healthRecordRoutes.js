import { Router } from "express";
import { getRecords, createRecord, deleteRecord } from "../controllers/healthRecordController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.route("/")
  .get(getRecords)
  .post(createRecord);

router.route("/:id")
  .delete(deleteRecord);

export default router;
