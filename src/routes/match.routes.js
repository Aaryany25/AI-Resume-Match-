import { Router } from "express";
import { uploadResume } from "../middlewares/upload.middleware.js";
import { matchController } from "../controllers/match.controller.js";

const router = Router();

// Supports multipart form-data (field "resume" + "jdText") or JSON
router.post("/", uploadResume.single("resume"), matchController);

export default router;
