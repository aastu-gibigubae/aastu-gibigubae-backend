import { Request, Response, NextFunction } from "express";

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<Response | void>;

export const asyncHandler = (controller: AsyncController) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    Promise.resolve(controller(req, res, next)).catch(next);
  };
};