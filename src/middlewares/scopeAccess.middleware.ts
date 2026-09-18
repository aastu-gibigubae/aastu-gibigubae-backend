import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.js";
import prisma from "../models/prisma.js";
import { ScopeArea } from "../generated/prisma/enums.js";

export const requireScopeAccess = (scope: ScopeArea) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      
      if (!user) {
        throw new AppError(401, "Authentication required");
      }

      // ADMIN has unrestricted access
      if (user.role === 'ADMIN') {
        return next();
      }

      if (user.role === 'SUB_ADMIN') {
        const permission = await prisma.adminScope.findUnique({
          where: {
            admin_user_id_scope_area: {
              admin_user_id: user.userId,
              scope_area: scope,
            }
          }
        });

        if (permission) {
          return next();
        }
      }

      throw new AppError(403, "You do not have permission to manage this module");
    } catch (error) {
      next(error);
    }
  };
};
