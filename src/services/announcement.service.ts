import prisma from '../models/prisma.js';
import { AppError } from '../utils/appError.js';

export interface CreateAnnouncementInput {
  title: string;
  message: string;
  expires_at: Date;
  is_active?: boolean;
  // Temporary — replace with req.user.userId once auth is wired into
  // these routes. Required by the schema, so must be provided in the
  // body for now.
  created_by: string;
}

export interface UpdateAnnouncementInput {
  title?: string;
  message?: string;
  expires_at?: Date;
  is_active?: boolean;
}

export async function listActiveAnnouncements() {
  return prisma.announcement.findMany({
    where: {
      is_active: true,
      expires_at: { gt: new Date() },
    },
    orderBy: { created_at: 'desc' },
  });
}

export async function getAnnouncementById(id: string) {
  const announcement = await prisma.announcement.findUnique({ where: { id } });
  if (!announcement) {
    throw new AppError(404, 'Announcement not found');
  }
  return announcement;
}

export async function createAnnouncement(input: CreateAnnouncementInput) {
  if (!input.title?.trim()) throw new AppError(400, 'title is required');
  if (!input.message?.trim()) throw new AppError(400, 'message is required');
  if (!input.expires_at) throw new AppError(400, 'expires_at is required');
  if (!input.created_by) throw new AppError(400, 'created_by is required');

  return prisma.announcement.create({
    data: {
      title: input.title.trim(),
      message: input.message.trim(),
      expires_at: input.expires_at,
      is_active: input.is_active ?? true,
      created_by: input.created_by,
    },
  });
}

export async function updateAnnouncement(id: string, input: UpdateAnnouncementInput) {
  await getAnnouncementById(id);

  if (input.title !== undefined && !input.title.trim()) {
    throw new AppError(400, 'title cannot be empty');
  }
  if (input.message !== undefined && !input.message.trim()) {
    throw new AppError(400, 'message cannot be empty');
  }

  return prisma.announcement.update({
    where: { id },
    data: {
      ...(input.title !== undefined && { title: input.title.trim() }),
      ...(input.message !== undefined && { message: input.message.trim() }),
      ...(input.expires_at !== undefined && { expires_at: input.expires_at }),
      ...(input.is_active !== undefined && { is_active: input.is_active }),
    },
  });
}

export async function deleteAnnouncement(id: string) {
  await getAnnouncementById(id);
  await prisma.announcement.delete({ where: { id } });
}