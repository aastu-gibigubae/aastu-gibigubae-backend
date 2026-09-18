import { Router } from "express";

import { createAuthMiddleware } from "../middlewares/auth.middleware.js";
import { requireScopeAccess } from "../middlewares/scopeAccess.middleware.js";
import { ScopeArea } from "../generated/prisma/enums.js";

import { asyncHandler } from "../utils/asyncHandler.js";

import {
  createGallery,
  getGalleries,
  getGalleryById,
  updateGallery,
  deleteGallery,
} from "../controllers/gallery.controller.js";

import { config } from "../../config/config.js";

const galleryRouter = Router();

const authenticate = createAuthMiddleware(config.JWT_PUBLIC_KEY);

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES — anyone can browse gallery images
|--------------------------------------------------------------------------
*/

galleryRouter.get("/", asyncHandler(getGalleries));

galleryRouter.get("/:id", asyncHandler(getGalleryById));

/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES — ADMIN and SUB_ADMIN only
| POST and PATCH accept JSON body with image_url field.
|--------------------------------------------------------------------------
*/

galleryRouter.post(
  "/",
  authenticate,
  requireScopeAccess(ScopeArea.GALLERY),
  asyncHandler(createGallery),
);

galleryRouter.patch(
  "/:id",
  authenticate,
  requireScopeAccess(ScopeArea.GALLERY),
  asyncHandler(updateGallery),
);

galleryRouter.delete(
  "/:id",
  authenticate,
  requireScopeAccess(ScopeArea.GALLERY),
  asyncHandler(deleteGallery),
);

export default galleryRouter;
