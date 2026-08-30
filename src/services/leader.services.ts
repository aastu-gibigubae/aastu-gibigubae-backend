import prisma from "../models/prisma.js";
import { AppError } from '../utils/appError.js';

export interface CreateLeaderInput {
  name: string;
  role: string;
  biography: string;
  profile_image_url?: string;
}

export interface UpdateLeaderInput {
  name?: string;
  role?: string;
  biography?: string;
  profile_image_url?: string | null;
}

//Creates a new Leader record.
export const createLeader = async (data: CreateLeaderInput) => {
  return prisma.leader.create({ data });
}

//Returns all Leader records ordered by creation date (newest first).
export const getLeaders = async () => {
  return prisma.leader.findMany({
    orderBy: { created_at: 'desc' },
  });
}

//Returns a single Leader by its UUID.
export const getLeaderById = async (id: string) => {
  const leader = await prisma.leader.findUnique({ where: { id } });
  if (!leader) {
    throw new AppError(404, `Leader with id '${id}' not found`);
  }
  return leader;
}

//Updates an existing Leader record.
 
export const updateLeader = async (id: string, data: UpdateLeaderInput) => {
  await getLeaderById(id);
  return prisma.leader.update({ where: { id }, data });
}

// Deletes a Leader record.
export const deleteLeader = async (id: string) => {
  await getLeaderById(id);
  return prisma.leader.delete({ where: { id } });
}