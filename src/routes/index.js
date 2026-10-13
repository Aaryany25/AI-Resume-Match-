import { Router } from "express";
import jdRoutes from "./jd.routes.js";
import resumeRoutes from "./resume.routes.js";
import matchRoutes from "./match.routes.js";

const apiRouter = Router();

// Health check
apiRouter.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

apiRouter.use("/jd", jdRoutes);
apiRouter.use("/resume", resumeRoutes);
apiRouter.use("/match", matchRoutes);

export default apiRouter;
