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

const router = Router();



// ADMIN / MANAGEMENT ROUTES



router.get(
  "/admin/all",
  asyncHandler(getAllEvents),
);

router.get(
  "/admin/:id",
  asyncHandler(getEventById),
);

router.post(
  "/",
  asyncHandler(createEvent),
);

router.patch(
  "/:id",
  asyncHandler(updateEvent),
);

router.delete(
  "/:id",
  asyncHandler(deleteEvent),
);



// PUBLIC ROUTES



router.get(
  "/",
  asyncHandler(getPublishedEvents),
);

router.get(
  "/:id",
  asyncHandler(getPublishedEventById),
);

export default router;