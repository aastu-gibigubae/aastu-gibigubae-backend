import { Request, Response, NextFunction } from "express";
import * as scopeService from "../services/adminScope.service.js";
import { successResponse } from "../utils/response.js";
import { ScopeArea } from "../generated/prisma/enums.js";

export const getScopes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId as string;
    const scopes = await scopeService.getScopes(userId);
    return successResponse(res, 200, "Admin scopes retrieved successfully", scopes);
  } catch (error) {
    next(error);
  }
};

export const grantScope = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId as string;
    const { scope_area } = req.body;
    
    // Auth middleware ensures req.user exists and has a userId
    const assignedBy = (req as any).user.userId;

    const scope = await scopeService.grantScope(userId, scope_area as ScopeArea, assignedBy);
    return successResponse(res, 201, "Admin scope granted successfully", scope);
  } catch (error) {
    next(error);
  }
};

export const revokeScope = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId as string;
    const scope_area = req.params.scope_area as string;
    await scopeService.revokeScope(userId, scope_area as ScopeArea);
    return successResponse(res, 200, "Admin scope revoked successfully");
  } catch (error) {
    next(error);
  }
};
