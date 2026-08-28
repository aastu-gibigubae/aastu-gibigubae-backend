import { Router } from "express";

import {
  createSubKiflat,
  deleteSubKiflat,
  getSubKiflatById,
  getSubKiflats,
  updateSubKiflat,
} from "../controllers/subKiflat.controller.js";

import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();


// ADMIN / MANAGEMENT ROUTES

router.post(
  "/",
  asyncHandler(createSubKiflat),
);

router.patch(
  "/:id",
  asyncHandler(updateSubKiflat),
);

router.delete(
  "/:id",
  asyncHandler(deleteSubKiflat),
);


// PUBLIC ROUTES

router.get(
  "/",
  asyncHandler(getSubKiflats),
);

router.get(
  "/:id",
  asyncHandler(getSubKiflatById),
);

export default router;