import { Request, Response, NextFunction } from "express";

import {
  createMediaItem as createMediaItemService,
  getAllMediaItems as getAllMediaItemsService,
  getMediaItemById as getMediaItemByIdService,
  updateMediaItem as updateMediaItemService,
  deleteMediaItem as deleteMediaItemService,
} from "../services/media.service.js";

import {
  createMediaItemSchema,
  updateMediaItemSchema,
  mediaItemIdSchema,
  mediaItemQuerySchema,
} from "../utils/media.validation.js";

import { successResponse, errorResponse } from "../utils/response.js";

//get all media
export const listMediaItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } = mediaItemQuerySchema.validate(req.query);

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid query parameters",
        error.details.map((detail) => detail.message),
      );
    }

    const result = await getAllMediaItemsService(value);

    return successResponse(
      res,
      200,
      "Media items retrieved successfully",
      result,
    );
  } catch (error) {
    return next(error);
  }
};

//search media
export const getMediaItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } = mediaItemIdSchema.validate(req.params);

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid media item ID",
        error.details.map((detail) => detail.message),
      );
    }

    const mediaItem = await getMediaItemByIdService(value.id);

    return successResponse(
      res,
      200,
      "Media item retrieved successfully",
      mediaItem,
    );
  } catch (error) {
    return next(error);
  }
};

//get all media for admin
export const adminListMediaItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } = mediaItemQuerySchema.validate(req.query);

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid query parameters",
        error.details.map((detail) => detail.message),
      );
    }

    const result = await getAllMediaItemsService(value);

    return successResponse(
      res,
      200,
      "All media items retrieved successfully",
      result,
    );
  } catch (error) {
    return next(error);
  }
};

//search media for admin
export const adminGetMediaItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } = mediaItemIdSchema.validate(req.params);

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid media item ID",
        error.details.map((detail) => detail.message),
      );
    }

    const mediaItem = await getMediaItemByIdService(value.id);

    return successResponse(
      res,
      200,
      "Media item retrieved successfully",
      mediaItem,
    );
  } catch (error) {
    return next(error);
  }
};

//create media for admin
export const createMediaItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } = createMediaItemSchema.validate(req.body);

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid media item data",
        error.details.map((detail) => detail.message),
      );
    }

    // Authenticated user's ID is attached by auth middleware
    const userId = req.user!.userId;

    const mediaItem = await createMediaItemService({ ...value, userId });

    return successResponse(
      res,
      201,
      "Media item created successfully",
      mediaItem,
    );
  } catch (error) {
    return next(error);
  }
};

//update media for admin
export const updateMediaItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const idValidation = mediaItemIdSchema.validate(req.params);

    if (idValidation.error) {
      return errorResponse(
        res,
        400,
        "Invalid media item ID",
        idValidation.error.details.map((detail) => detail.message),
      );
    }

    const bodyValidation = updateMediaItemSchema.validate(req.body);

    if (bodyValidation.error) {
      return errorResponse(
        res,
        400,
        "Invalid media item data",
        bodyValidation.error.details.map((detail) => detail.message),
      );
    }

    // Require at least one field to update
    if (Object.keys(bodyValidation.value).length === 0) {
      return errorResponse(
        res,
        400,
        "At least one field must be provided to update",
      );
    }

    const mediaItem = await updateMediaItemService(
      idValidation.value.id,
      bodyValidation.value,
    );

    return successResponse(
      res,
      200,
      "Media item updated successfully",
      mediaItem,
    );
  } catch (error) {
    return next(error);
  }
};

//delete media for admin
export const deleteMediaItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } = mediaItemIdSchema.validate(req.params);

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid media item ID",
        error.details.map((detail) => detail.message),
      );
    }

    await deleteMediaItemService(value.id);

    return successResponse(res, 200, "Media item deleted successfully");
  } catch (error) {
    return next(error);
  }
};
