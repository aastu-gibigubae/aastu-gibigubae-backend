import { Router } from "express";

import {
  createKiflat,
  deleteKiflat,
  getKiflatById,
  getKiflats,
  updateKiflat,
} from "../controllers/kiflat.controller";

import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();


// ADMIN / MANAGEMENT ROUTES

router.post(
  "/",
  asyncHandler(createKiflat),
);

router.patch(
  "/:id",
  asyncHandler(updateKiflat),
);

router.delete(
  "/:id",
  asyncHandler(deleteKiflat),
);


// PUBLIC ROUTES

router.get(
  "/",
  asyncHandler(getKiflats),
);

router.get(
  "/:id",
  asyncHandler(getKiflatById),
);

export default router;