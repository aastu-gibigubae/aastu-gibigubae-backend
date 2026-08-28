import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createKiflat as createKiflatService,
  deleteKiflat as deleteKiflatService,
  getKiflatById as getKiflatByIdService,
  getKiflats as getKiflatsService,
  updateKiflat as updateKiflatService,
} from "../services/kiflat.service.js";

import {
  createKiflatSchema,
  kiflatIdSchema,
  kiflatQuerySchema,
  updateKiflatSchema,
} from "../utils/kflat.validation.js";

import {
  errorResponse,
  successResponse,
} from "../utils/response.js";


/*
|--------------------------------------------------------------------------
| CREATE KIFLAT
|--------------------------------------------------------------------------
*/

export const createKiflat = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } =
      createKiflatSchema.validate(
        req.body,
      );

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid Kiflat data",
        error.details.map(
          (detail) => detail.message,
        ),
      );
    }

    const kiflat =
      await createKiflatService(value);

    return successResponse(
      res,
      201,
      "Kiflat created successfully",
      kiflat,
    );
  } catch (error) {
    return next(error);
  }
};


/*
|--------------------------------------------------------------------------
| GET KIFLATS
|--------------------------------------------------------------------------
*/

export const getKiflats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } =
      kiflatQuerySchema.validate(
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
      await getKiflatsService(value);

    return successResponse(
      res,
      200,
      "Kiflats retrieved successfully",
      result,
    );
  } catch (error) {
    return next(error);
  }
};


/*
|--------------------------------------------------------------------------
| GET KIFLAT BY ID
|--------------------------------------------------------------------------
*/

export const getKiflatById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } =
      kiflatIdSchema.validate(
        req.params,
      );

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid Kiflat ID",
        error.details.map(
          (detail) => detail.message,
        ),
      );
    }

    const kiflat =
      await getKiflatByIdService(
        value.id,
      );

    if (!kiflat) {
      return errorResponse(
        res,
        404,
        "Kiflat not found",
      );
    }

    return successResponse(
      res,
      200,
      "Kiflat retrieved successfully",
      kiflat,
    );
  } catch (error) {
    return next(error);
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE KIFLAT
|--------------------------------------------------------------------------
*/

export const updateKiflat = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const idValidation =
      kiflatIdSchema.validate(
        req.params,
      );

    if (idValidation.error) {
      return errorResponse(
        res,
        400,
        "Invalid Kiflat ID",
        idValidation.error.details.map(
          (detail) => detail.message,
        ),
      );
    }

    const bodyValidation =
      updateKiflatSchema.validate(
        req.body,
      );

    if (bodyValidation.error) {
      return errorResponse(
        res,
        400,
        "Invalid Kiflat data",
        bodyValidation.error.details.map(
          (detail) => detail.message,
        ),
      );
    }

    const existingKiflat =
      await getKiflatByIdService(
        idValidation.value.id,
      );

    if (!existingKiflat) {
      return errorResponse(
        res,
        404,
        "Kiflat not found",
      );
    }

    const kiflat =
      await updateKiflatService(
        idValidation.value.id,
        bodyValidation.value,
      );

    return successResponse(
      res,
      200,
      "Kiflat updated successfully",
      kiflat,
    );
  } catch (error) {
    return next(error);
  }
};


/*
|--------------------------------------------------------------------------
| DELETE KIFLAT
|--------------------------------------------------------------------------
*/

export const deleteKiflat = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } =
      kiflatIdSchema.validate(
        req.params,
      );

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid Kiflat ID",
        error.details.map(
          (detail) => detail.message,
        ),
      );
    }

    const existingKiflat =
      await getKiflatByIdService(
        value.id,
      );

    if (!existingKiflat) {
      return errorResponse(
        res,
        404,
        "Kiflat not found",
      );
    }

    await deleteKiflatService(value.id);

    return successResponse(
      res,
      200,
      "Kiflat deleted successfully",
    );
  } catch (error) {
    return next(error);
  }
};