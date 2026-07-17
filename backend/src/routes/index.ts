import { Router } from "express";
import chatRoutes from "./chatRoutes";
import transitRoutes from "./transitRoutes";
import telemetryRoutes from "./telemetryRoutes";

const router = Router();

router.use("/chat", chatRoutes);
router.use("/transit", transitRoutes);
router.use("/telemetry", telemetryRoutes);

export default router;
