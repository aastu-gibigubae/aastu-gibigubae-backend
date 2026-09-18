import { Router } from "express";

import {
  createMagazine,
  deleteMagazine,
  getAllMagazines,
  getMagazineById,
  getPublishedMagazineById,
  getPublishedMagazines,
  updateMagazine,
} from "../controllers/magazine.controller.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { createAuthMiddleware} from "../middlewares/auth.middleware.js";
import { requireScopeAccess } from "../middlewares/scopeAccess.middleware.js";
import { ScopeArea } from "../generated/prisma/enums.js";
import { strictLimiter } from "../middlewares/rateLimit.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { sanitizeRichText } from "../middlewares/sanitize.middleware.js";
import { createMagazineSchema, updateMagazineSchema, magazineIdSchema } from "../utils/magazine.validation.js";
import { config } from "../../config/config.js";

const router = Router();
const authenticate = createAuthMiddleware(config.JWT_PUBLIC_KEY);

//ADMIN

router.get(
  "/admin/all",
  authenticate,
  requireScopeAccess(ScopeArea.MAGAZINE),
  strictLimiter,
  asyncHandler(getAllMagazines),
);

router.get(
  "/admin/:id",
  authenticate,
  requireScopeAccess(ScopeArea.MAGAZINE),
  strictLimiter,
  validate(magazineIdSchema, 'params'),
  asyncHandler(getMagazineById),
);

router.post(
  "/",
  authenticate,
  requireScopeAccess(ScopeArea.MAGAZINE),
  strictLimiter,
  sanitizeRichText,
  validate(createMagazineSchema),
  asyncHandler(createMagazine),
);

router.patch(
  "/:id",
  authenticate,
  requireScopeAccess(ScopeArea.MAGAZINE),
  strictLimiter,
  sanitizeRichText,
  validate(magazineIdSchema, 'params'),
  validate(updateMagazineSchema),
  asyncHandler(updateMagazine),
);

router.delete(
  "/:id",
  authenticate,
  requireScopeAccess(ScopeArea.MAGAZINE),
  strictLimiter,
  validate(magazineIdSchema, 'params'),
  asyncHandler(deleteMagazine),
);

//PUBLIC

router.get(
  "/",
  asyncHandler(getPublishedMagazines),
);

router.get(
  "/:id",
  validate(magazineIdSchema, 'params'),
  asyncHandler(getPublishedMagazineById),
);

export default router;