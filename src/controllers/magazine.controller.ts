import { Request, Response, NextFunction } from "express";

import {
  createMagazine as createMagazineService,
  deleteMagazine as deleteMagazineService,
  getAllMagazines as getAllMagazinesService,
  getMagazineById as getMagazineByIdService,
  getPublishedMagazineById as getPublishedMagazineByIdService,
  getPublishedMagazines as getPublishedMagazinesService,
  updateMagazine as updateMagazineService,
} from "../services/magazine.service.js";

import {
  createMagazineSchema,
  magazineIdSchema,
  magazineQuerySchema,
  updateMagazineSchema,
} from "../utils/magazine.validation.js";

import {
  errorResponse,
  successResponse,
} from "../utils/response.js";


export const createMagazine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } =
      createMagazineSchema.validate(req.body);

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid magazine data",
        error.details.map(
          (detail) => detail.message,
        ),
      );
    }

    const magazine =
      await createMagazineService(value);

    return successResponse(
      res,
      201,
      "Magazine published successfully",
      magazine,
    );
  } catch (error) {
    return next(error);
  }
};


//PUBLIC - LIST MAGAZINES


export const getPublishedMagazines = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } =
      magazineQuerySchema.validate(
        req.query,
      );

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid query parameters",
        error.details.map(
          (detail) => detail.message,
        ),
      );
    }

    const result =
      await getPublishedMagazinesService(
        value,
      );

    return successResponse(
      res,
      200,
      "Published magazines retrieved successfully",
      result,
    );
  } catch (error) {
    return next(error);
  }
};


//PUBLIC - GET ONE


export const getPublishedMagazineById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } =
      magazineIdSchema.validate(
        req.params,
      );

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid magazine ID",
        error.details.map(
          (detail) => detail.message,
        ),
      );
    }

    const magazine =
      await getPublishedMagazineByIdService(
        value.id,
      );

    if (!magazine) {
      return errorResponse(
        res,
        404,
        "Published magazine not found",
      );
    }

    return successResponse(
      res,
      200,
      "Magazine retrieved successfully",
      magazine,
    );
  } catch (error) {
    return next(error);
  }
};


//ADMIN - LIST ALL


export const getAllMagazines = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } =
      magazineQuerySchema.validate(
        req.query,
      );

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid query parameters",
        error.details.map(
          (detail) => detail.message,
        ),
      );
    }

    const result =
      await getAllMagazinesService(
        value,
      );

    return successResponse(
      res,
      200,
      "All magazines retrieved successfully",
      result,
    );
  } catch (error) {
    return next(error);
  }
};

export const getMagazineById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } =
      magazineIdSchema.validate(req.params);

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid magazine ID",
        error.details.map(
          (detail) => detail.message,
        ),
      );
    }

    const magazine =
      await getMagazineByIdService(value.id);

    if (!magazine) {
      return errorResponse(
        res,
        404,
        "Magazine not found",
      );
    }

    return successResponse(
      res,
      200,
      "Magazine retrieved successfully",
      magazine,
    );
  } catch (error) {
    return next(error);
  }
};


export const updateMagazine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const idValidation =
      magazineIdSchema.validate(req.params);

    if (idValidation.error) {
      return errorResponse(
        res,
        400,
        "Invalid magazine ID",
        idValidation.error.details.map(
          (detail) => detail.message,
        ),
      );
    }

    const bodyValidation =
      updateMagazineSchema.validate(req.body);

    if (bodyValidation.error) {
      return errorResponse(
        res,
        400,
        "Invalid magazine data",
        bodyValidation.error.details.map(
          (detail) => detail.message,
        ),
      );
    }

    const existingMagazine =
      await getMagazineByIdService(
        idValidation.value.id,
      );

    if (!existingMagazine) {
      return errorResponse(
        res,
        404,
        "Magazine not found",
      );
    }

    const magazine =
      await updateMagazineService(
        idValidation.value.id,
        bodyValidation.value,
      );

    return successResponse(
      res,
      200,
      "Magazine updated successfully",
      magazine,
    );
  } catch (error) {
    return next(error);
  }
};


export const deleteMagazine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } =
      magazineIdSchema.validate(req.params);

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid magazine ID",
        error.details.map(
          (detail) => detail.message,
        ),
      );
    }

    const existingMagazine =
      await getMagazineByIdService(value.id);

    if (!existingMagazine) {
      return errorResponse(
        res,
        404,
        "Magazine not found",
      );
    }

    await deleteMagazineService(value.id);

    return successResponse(
      res,
      200,
      "Magazine deleted successfully",
    );
  } catch (error) {
    return next(error);
  }
};