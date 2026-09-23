import { Router } from "express";

import { createAuthMiddleware } from "../middlewares/auth.middleware.js";
import { requireScopeAccess } from "../middlewares/scopeAccess.middleware.js";
import { ScopeArea } from "../generated/prisma/enums.js";
import { strictLimiter } from "../middlewares/rateLimit.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  mediaItemIdSchema,
  mediaItemQuerySchema,
  createMediaItemSchema,
  updateMediaItemSchema,
} from "../utils/media.validation.js";

import {
  listMediaItems,
  getMediaItem,
  adminListMediaItems,
  adminGetMediaItem,
  createMediaItem,
  updateMediaItem,
  deleteMediaItem,
} from "../controllers/media.controller.js";

import { config } from "../../config/config.js";

const router = Router();
const authenticate = createAuthMiddleware(config.JWT_PUBLIC_KEY);

//admin routes
router.get(
  "/admin/all",
  authenticate,
  requireScopeAccess(ScopeArea.MEDIA),
  strictLimiter,
  validate(mediaItemQuerySchema, "query"),
  asyncHandler(adminListMediaItems),
);

router.get(
  "/admin/:id",
  authenticate,
  requireScopeAccess(ScopeArea.MEDIA),
  strictLimiter,
  validate(mediaItemIdSchema, "params"),
  asyncHandler(adminGetMediaItem),
);

router.post(
  "/",
  authenticate,
  requireScopeAccess(ScopeArea.MEDIA),
  strictLimiter,
  validate(createMediaItemSchema),
  asyncHandler(createMediaItem),
);

router.patch(
  "/:id",
  authenticate,
  requireScopeAccess(ScopeArea.MEDIA),
  strictLimiter,
  validate(mediaItemIdSchema, "params"),
  validate(updateMediaItemSchema),
  asyncHandler(updateMediaItem),
);

router.delete(
  "/:id",
  authenticate,
  requireScopeAccess(ScopeArea.MEDIA),
  strictLimiter,
  validate(mediaItemIdSchema, "params"),
  asyncHandler(deleteMediaItem),
);

//public routes
router.get(
  "/",
  validate(mediaItemQuerySchema, "query"),
  asyncHandler(listMediaItems),
);

router.get(
  "/:id",
  validate(mediaItemIdSchema, "params"),
  asyncHandler(getMediaItem),
);

export default router;
