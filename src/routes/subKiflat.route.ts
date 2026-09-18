import { Router } from "express";

import {
  createSubKiflat,
  deleteSubKiflat,
  getSubKiflatById,
  getSubKiflats,
  updateSubKiflat,
} from "../controllers/subKiflat.controller.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { createAuthMiddleware} from "../middlewares/auth.middleware.js";
import { requireScopeAccess } from "../middlewares/scopeAccess.middleware.js";
import { ScopeArea } from "../generated/prisma/enums.js";
import { strictLimiter } from "../middlewares/rateLimit.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { sanitizeRichText } from "../middlewares/sanitize.middleware.js";
import { createSubKiflatSchema, updateSubKiflatSchema, subKiflatIdSchema } from "../utils/subKiflat.validation.js";
import { config } from "../../config/config.js";

const router = Router();
const authenticate = createAuthMiddleware(config.JWT_PUBLIC_KEY);

// ADMIN / MANAGEMENT ROUTES

router.post(
  "/",
  authenticate,
  requireScopeAccess(ScopeArea.KIFLAT),
  strictLimiter,
  sanitizeRichText,
  validate(createSubKiflatSchema),
  asyncHandler(createSubKiflat),
);

router.patch(
  "/:id",
  authenticate,
  requireScopeAccess(ScopeArea.KIFLAT),
  strictLimiter,
  sanitizeRichText,
  validate(subKiflatIdSchema, 'params'),
  validate(updateSubKiflatSchema),
  asyncHandler(updateSubKiflat),
);

router.delete(
  "/:id",
  authenticate,
  requireScopeAccess(ScopeArea.KIFLAT),
  strictLimiter,
  validate(subKiflatIdSchema, 'params'),
  asyncHandler(deleteSubKiflat),
);

// PUBLIC ROUTES

router.get(
  "/",
  asyncHandler(getSubKiflats),
);

router.get(
  "/:id",
  validate(subKiflatIdSchema, 'params'),
  asyncHandler(getSubKiflatById),
);

export default router;