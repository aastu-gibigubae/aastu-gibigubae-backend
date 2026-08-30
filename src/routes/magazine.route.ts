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

const router = Router();

//ADMIN


router.get(
  "/admin/all",
  asyncHandler(getAllMagazines),
);

router.get(
  "/admin/:id",
  asyncHandler(getMagazineById),
);

router.post(
  "/",
  asyncHandler(createMagazine),
);

router.patch(
  "/:id",
  asyncHandler(updateMagazine),
);

router.delete(
  "/:id",
  asyncHandler(deleteMagazine),
);


//PUBLIC


router.get(
  "/",
  asyncHandler(getPublishedMagazines),
);

router.get(
  "/:id",
  asyncHandler(getPublishedMagazineById),
);

export default router;