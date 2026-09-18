import { Router } from "express";

import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  getPublishedEventById,
  getPublishedEvents,
  updateEvent,
} from "../controllers/event.controller.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { createAuthMiddleware} from "../middlewares/auth.middleware.js";
import { requireScopeAccess } from "../middlewares/scopeAccess.middleware.js";
import { ScopeArea } from "../generated/prisma/enums.js";
import { strictLimiter } from "../middlewares/rateLimit.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { sanitizeRichText } from "../middlewares/sanitize.middleware.js";
import { createEventSchema, updateEventSchema, eventIdSchema } from "../utils/event.validation.js";
import { config } from "../../config/config.js";

const router = Router();
const authenticate = createAuthMiddleware(config.JWT_PUBLIC_KEY);

// ADMIN / MANAGEMENT ROUTES

router.get(
  "/admin/all",
  authenticate,
  requireScopeAccess(ScopeArea.EVENTS),
  strictLimiter,
  asyncHandler(getAllEvents),
);

router.get(
  "/admin/:id",
  authenticate,
  requireScopeAccess(ScopeArea.EVENTS),
  strictLimiter,
  validate(eventIdSchema, 'params'),
  asyncHandler(getEventById),
);

router.post(
  "/",
  authenticate,
  requireScopeAccess(ScopeArea.EVENTS),
  strictLimiter,
  sanitizeRichText,
  validate(createEventSchema),
  asyncHandler(createEvent),
);

router.patch(
  "/:id",
  authenticate,
  requireScopeAccess(ScopeArea.EVENTS),
  strictLimiter,
  sanitizeRichText,
  validate(eventIdSchema, 'params'),
  validate(updateEventSchema),
  asyncHandler(updateEvent),
);

router.delete(
  "/:id",
  authenticate,
  requireScopeAccess(ScopeArea.EVENTS),
  strictLimiter,
  validate(eventIdSchema, 'params'),
  asyncHandler(deleteEvent),
);

// PUBLIC ROUTES

router.get(
  "/",
  asyncHandler(getPublishedEvents),
);

router.get(
  "/:id",
  validate(eventIdSchema, 'params'),
  asyncHandler(getPublishedEventById),
);

export default router;