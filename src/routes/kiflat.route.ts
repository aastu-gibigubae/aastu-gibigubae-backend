import { Router } from "express";

import {
  createKiflat,
  deleteKiflat,
  getKiflatById,
  getKiflats,
  updateKiflat,
} from "../controllers/kiflat.controller.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { createAuthMiddleware, requireRole } from "../middlewares/auth.middleware.js";
import { strictLimiter } from "../middlewares/rateLimit.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { sanitizeRichText } from "../middlewares/sanitize.middleware.js";
import { createKiflatSchema, updateKiflatSchema, kiflatIdSchema } from "../utils/kflat.validation.js";
import { config } from "../../config/config.js";

const router = Router();
const authenticate = createAuthMiddleware(config.JWT_PUBLIC_KEY);

// ADMIN / MANAGEMENT ROUTES

router.post(
  "/",
  authenticate,
  requireRole('ADMIN', 'SUB_ADMIN'),
  strictLimiter,
  sanitizeRichText,
  validate(createKiflatSchema),
  asyncHandler(createKiflat),
);

router.patch(
  "/:id",
  authenticate,
  requireRole('ADMIN', 'SUB_ADMIN'),
  strictLimiter,
  sanitizeRichText,
  validate(kiflatIdSchema, 'params'),
  validate(updateKiflatSchema),
  asyncHandler(updateKiflat),
);

router.delete(
  "/:id",
  authenticate,
  requireRole('ADMIN', 'SUB_ADMIN'),
  strictLimiter,
  validate(kiflatIdSchema, 'params'),
  asyncHandler(deleteKiflat),
);

// PUBLIC ROUTES

router.get(
  "/",
  asyncHandler(getKiflats),
);

router.get(
  "/:id",
  validate(kiflatIdSchema, 'params'),
  asyncHandler(getKiflatById),
);

export default router;