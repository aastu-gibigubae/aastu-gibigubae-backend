import { Request, Response, NextFunction } from "express";

import {
  createGallery as createGalleryService,
  getGalleries as getGalleriesService,
  getGalleryById as getGalleryByIdService,
  updateGallery as updateGalleryService,
  deleteGallery as deleteGalleryService,
} from "../services/gallery.services.js";

import {
  createGallerySchema,
  updateGallerySchema,
  galleryIdParamSchema,
} from "../utils/gallery.validation.js";

import { successResponse, errorResponse } from "../utils/response.js";

//CREATE GALLERY IMAGE

export const createGallery = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } = createGallerySchema.validate(req.body);

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid gallery image data",
        error.details.map((detail) => detail.message),
      );
    }

    // Authenticated user's ID is attached by auth middleware
    const uploadedBy = req.user!.userId;

    const gallery = await createGalleryService({
      ...value,
      uploaded_by: uploadedBy,
    });

    return successResponse(res, 201, "Gallery image created successfully", gallery);
  } catch (error) {
    return next(error);
  }
};

//GET ALL GALLERY IMAGES


export const getGalleries = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const galleries = await getGalleriesService();
    return successResponse(res, 200, "Gallery images retrieved successfully", galleries);
  } catch (error) {
    return next(error);
  }
};

//GET GALLERY IMAGE BY ID


export const getGalleryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } = galleryIdParamSchema.validate(req.params);

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid gallery image ID",
        error.details.map((detail) => detail.message),
      );
    }

    const gallery = await getGalleryByIdService(value.id);
    return successResponse(res, 200, "Gallery image retrieved successfully", gallery);
  } catch (error) {
    return next(error);
  }
};

//UPDATE GALLERY IMAGE


export const updateGallery = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const idValidation = galleryIdParamSchema.validate(req.params);

    if (idValidation.error) {
      return errorResponse(
        res,
        400,
        "Invalid gallery image ID",
        idValidation.error.details.map((detail) => detail.message),
      );
    }

    const bodyValidation = updateGallerySchema.validate(req.body);

    if (bodyValidation.error) {
      return errorResponse(
        res,
        400,
        "Invalid gallery image data",
        bodyValidation.error.details.map((detail) => detail.message),
      );
    }

    // Require at least one field to update
    if (Object.keys(bodyValidation.value).length === 0) {
      return errorResponse(
        res,
        400,
        "At least one field (image_url, title, or description) must be provided to update",
      );
    }

    const gallery = await updateGalleryService(idValidation.value.id, bodyValidation.value);

    return successResponse(res, 200, "Gallery image updated successfully", gallery);
  } catch (error) {
    return next(error);
  }
};

//DELETE GALLERY IMAGE


export const deleteGallery = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } = galleryIdParamSchema.validate(req.params);

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid gallery image ID",
        error.details.map((detail) => detail.message),
      );
    }

    await deleteGalleryService(value.id);

    return successResponse(res, 200, "Gallery image deleted successfully");
  } catch (error) {
    return next(error);
  }
};
