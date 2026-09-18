import prisma from "../models/prisma.js";
import { ScopeArea } from "../generated/prisma/enums.js";

export const getScopes = async (userId: string) => {
  return prisma.adminScope.findMany({
    where: { admin_user_id: userId },
    orderBy: { assigned_at: 'desc' }
  });
};

export const grantScope = async (userId: string, scope_area: ScopeArea, assigned_by: string) => {
  return prisma.adminScope.upsert({
    where: {
      admin_user_id_scope_area: {
        admin_user_id: userId,
        scope_area,
      }
    },
    update: {}, // If it exists, do nothing (or update assigned_by/assigned_at if we wanted)
    create: {
      admin_user_id: userId,
      scope_area,
      assigned_by,
    }
  });
};

export const revokeScope = async (userId: string, scope_area: ScopeArea) => {
  return prisma.adminScope.deleteMany({
    where: {
      admin_user_id: userId,
      scope_area,
    }
  });
};
