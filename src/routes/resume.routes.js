import { Router } from "express";
import { uploadResume } from "../middlewares/upload.middleware.js";
import { parseResumeController } from "../controllers/resume.controller.js";

const router = Router();

// Supports multipart form-data (field name "resume") or application/json body
router.post("/parse", uploadResume.single("resume"), parseResumeController);

export default router;
