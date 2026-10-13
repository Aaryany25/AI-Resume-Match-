import { Router } from "express";
import { parseJdController } from "../controllers/jd.controller.js";

const router = Router();

router.post("/parse", parseJdController);

export default router;
