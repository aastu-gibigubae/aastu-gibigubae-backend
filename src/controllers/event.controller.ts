import { Request, Response, NextFunction } from "express";

import {
  createEvent as createEventService,
  deleteEvent as deleteEventService,
  getAllEvents as getAllEventsService,
  getEventById as getEventByIdService,
  getPublishedEventById as getPublishedEventByIdService,
  getPublishedEvents as getPublishedEventsService,
  updateEvent as updateEventService,
} from "../services/event.service.js";

import {
  createEventSchema,
  eventIdSchema,
  updateEventSchema,
} from "../utils/event.validation.js";

import {
  errorResponse,
  successResponse,
} from "../utils/response.js";

const getPaginationQuery = (req: Request) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);

  return {
    page:
      Number.isInteger(page) && page > 0
        ? page
        : 1,

    limit:
      Number.isInteger(limit) && limit > 0
        ? Math.min(limit, 50)
        : 10,
  };
};


export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } =
      createEventSchema.validate(req.body);

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid event data",
        error.details.map(
          (detail) => detail.message,
        ),
      );
    }

    const event = await createEventService(value);

    return successResponse(
      res,
      201,
      "Event created successfully",
      event,
    );
  } catch (error) {
    return next(error);
  }
};


export const getPublishedEvents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = getPaginationQuery(req);

    const result =
      await getPublishedEventsService(query);

    return successResponse(
      res,
      200,
      "Published events retrieved successfully",
      result,
    );
  } catch (error) {
    return next(error);
  }
};


export const getPublishedEventById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } =
      eventIdSchema.validate(req.params);

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid event ID",
        error.details.map(
          (detail) => detail.message,
        ),
      );
    }

    const event =
      await getPublishedEventByIdService(value.id);

    if (!event) {
      return errorResponse(
        res,
        404,
        "Published event not found",
      );
    }

    return successResponse(
      res,
      200,
      "Event retrieved successfully",
      event,
    );
  } catch (error) {
    return next(error);
  }
};


export const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = getPaginationQuery(req);

    const result =
      await getAllEventsService(query);

    return successResponse(
      res,
      200,
      "All events retrieved successfully",
      result,
    );
  } catch (error) {
    return next(error);
  }
};


export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } =
      eventIdSchema.validate(req.params);

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid event ID",
        error.details.map(
          (detail) => detail.message,
        ),
      );
    }

    const event =
      await getEventByIdService(value.id);

    if (!event) {
      return errorResponse(
        res,
        404,
        "Event not found",
      );
    }

    return successResponse(
      res,
      200,
      "Event retrieved successfully",
      event,
    );
  } catch (error) {
    return next(error);
  }
};


export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const idValidation =
      eventIdSchema.validate(req.params);

    if (idValidation.error) {
      return errorResponse(
        res,
        400,
        "Invalid event ID",
        idValidation.error.details.map(
          (detail) => detail.message,
        ),
      );
    }

    const bodyValidation =
      updateEventSchema.validate(req.body);

    if (bodyValidation.error) {
      return errorResponse(
        res,
        400,
        "Invalid event data",
        bodyValidation.error.details.map(
          (detail) => detail.message,
        ),
      );
    }

    const existingEvent =
      await getEventByIdService(
        idValidation.value.id,
      );

    if (!existingEvent) {
      return errorResponse(
        res,
        404,
        "Event not found",
      );
    }

    const event =
      await updateEventService(
        idValidation.value.id,
        bodyValidation.value,
      );

    return successResponse(
      res,
      200,
      "Event updated successfully",
      event,
    );
  } catch (error) {
    return next(error);
  }
};


export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } =
      eventIdSchema.validate(req.params);

    if (error) {
      return errorResponse(
        res,
        400,
        "Invalid event ID",
        error.details.map(
          (detail) => detail.message,
        ),
      );
    }

    const existingEvent =
      await getEventByIdService(value.id);

    if (!existingEvent) {
      return errorResponse(
        res,
        404,
        "Event not found",
      );
    }

    await deleteEventService(value.id);

    return successResponse(
      res,
      200,
      "Event deleted successfully",
    );
  } catch (error) {
    return next(error);
  }
};