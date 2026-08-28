import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createSubKiflat as createSubKiflatService,
  deleteSubKiflat as deleteSubKiflatService,
  getSubKiflatById as getSubKiflatByIdService,
  getSubKiflats as getSubKiflatsService,
  updateSubKiflat as updateSubKiflatService,
} from "../services/subKiflat.service.js";

import {
  createSubKiflatSchema,
  subKiflatIdSchema,
  subKiflatQuerySchema,
  updateSubKiflatSchema,
} from "../utils/subKiflat.validation.js";

import {
  errorResponse,
  successResponse,
} from "../utils/response.js";


export const createSubKiflat = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } =
      createSubKiflatSchema.validate(
        req.body,
      );

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid Sub-Kiflat data",
        error.details.map(
          (detail) => detail.message,
        ),
      );
    }

    const subKiflat =
      await createSubKiflatService(value);

    return successResponse(
      res,
      201,
      "Sub-Kiflat created successfully",
      subKiflat,
    );
  } catch (error) {
    return next(error);
  }
};

export const getSubKiflats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } =
      subKiflatQuerySchema.validate(
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
      await getSubKiflatsService(value);

    return successResponse(
      res,
      200,
      "Sub-Kiflats retrieved successfully",
      result,
    );
  } catch (error) {
    return next(error);
  }
};



export const getSubKiflatById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } =
      subKiflatIdSchema.validate(
        req.params,
      );

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid Sub-Kiflat ID",
        error.details.map(
          (detail) => detail.message,
        ),
      );
    }

    const subKiflat =
      await getSubKiflatByIdService(
        value.id,
      );

    if (!subKiflat) {
      return errorResponse(
        res,
        404,
        "Sub-Kiflat not found",
      );
    }

    return successResponse(
      res,
      200,
      "Sub-Kiflat retrieved successfully",
      subKiflat,
    );
  } catch (error) {
    return next(error);
  }
};


export const updateSubKiflat = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const idValidation =
      subKiflatIdSchema.validate(
        req.params,
      );

    if (idValidation.error) {
      return errorResponse(
        res,
        400,
        "Invalid Sub-Kiflat ID",
        idValidation.error.details.map(
          (detail) => detail.message,
        ),
      );
    }

    const bodyValidation =
      updateSubKiflatSchema.validate(
        req.body,
      );

    if (bodyValidation.error) {
      return errorResponse(
        res,
        400,
        "Invalid Sub-Kiflat data",
        bodyValidation.error.details.map(
          (detail) => detail.message,
        ),
      );
    }

    const existingSubKiflat =
      await getSubKiflatByIdService(
        idValidation.value.id,
      );

    if (!existingSubKiflat) {
      return errorResponse(
        res,
        404,
        "Sub-Kiflat not found",
      );
    }

    const subKiflat =
      await updateSubKiflatService(
        idValidation.value.id,
        bodyValidation.value,
      );

    return successResponse(
      res,
      200,
      "Sub-Kiflat updated successfully",
      subKiflat,
    );
  } catch (error) {
    return next(error);
  }
};




export const deleteSubKiflat = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } =
      subKiflatIdSchema.validate(
        req.params,
      );

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid Sub-Kiflat ID",
        error.details.map(
          (detail) => detail.message,
        ),
      );
    }

    const existingSubKiflat =
      await getSubKiflatByIdService(
        value.id,
      );

    if (!existingSubKiflat) {
      return errorResponse(
        res,
        404,
        "Sub-Kiflat not found",
      );
    }

    await deleteSubKiflatService(
      value.id,
    );

    return successResponse(
      res,
      200,
      "Sub-Kiflat deleted successfully",
    );
  } catch (error) {
    return next(error);
  }
};