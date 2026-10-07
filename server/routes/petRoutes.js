import { Router } from "express";
import { getPets, createPet, getVaccinations, addVaccination } from "../controllers/petController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.route("/")
  .get(getPets)
  .post(createPet);

router.route("/vaccinations")
  .get(getVaccinations)
  .post(addVaccination);

export default router;
