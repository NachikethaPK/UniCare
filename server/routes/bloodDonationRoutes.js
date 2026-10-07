import { Router } from "express";
import { getDonors, createDonor, getRequests, createRequest, updateRequestStatus } from "../controllers/bloodDonationController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.route("/donors")
  .get(getDonors)
  .post(createDonor);

router.route("/requests")
  .get(getRequests)
  .post(createRequest);

router.route("/requests/:id/status")
  .patch(updateRequestStatus);

export default router;
