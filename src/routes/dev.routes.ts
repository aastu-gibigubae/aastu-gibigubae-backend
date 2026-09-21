import { Router } from "express";
import { createMockToken } from "../controllers/dev.controller.js";

const router = Router();

// Entirely absent in production — see the explicit NODE_ENV check inside
// createMockToken as a second layer of protection.
router.post("/mock-token", createMockToken);

export default router;