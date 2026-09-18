import prisma from '../models/prisma.js';
import { AppError } from '../utils/appError.js';

export interface CreateAnnouncementInput {
  title: string;
  content: string;
  expires_at: Date;
  is_active?: boolean;
  // Temporary — replace with req.user.userId once auth is wired into
  // these routes. Required by the schema, so must be provided in the
  // body for now.
  userId: string;
}

export interface UpdateAnnouncementInput {
  title?: string;
  content?: string;
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
    select: {
      id: true,
      title: true,
      content: true,
      expires_at: true,
      is_active: true,
      created_at: true,
      updated_at: true,
    }
  });
}

export async function getAnnouncementById(id: string, isPublic = false) {
  const where: any = { id };
  if (isPublic) {
    where.is_active = true;
    where.expires_at = { gt: new Date() };
  }

  const announcement = await prisma.announcement.findUnique({ 
    where,
    select: {
      id: true,
      title: true,
      content: true,
      expires_at: true,
      is_active: true,
      created_at: true,
      updated_at: true,
      ...(!isPublic ? { userId: true } : {})
    }
  });
  if (!announcement) {
    throw new AppError(404, 'Announcement not found');
  }
  return announcement;
}

export async function createAnnouncement(input: CreateAnnouncementInput) {
  if (!input.title?.trim()) throw new AppError(400, 'title is required');
  if (!input.content?.trim()) throw new AppError(400, 'content is required');
  if (!input.expires_at) throw new AppError(400, 'expires_at is required');
  if (!input.userId) throw new AppError(400, 'userId is required');

  return prisma.announcement.create({
    data: {
      title: input.title.trim(),
      content: input.content.trim(),
      expires_at: input.expires_at,
      is_active: input.is_active ?? true,
      userId: input.userId,
    },
  });
}

export async function updateAnnouncement(id: string, input: UpdateAnnouncementInput) {
  await getAnnouncementById(id);

  if (input.title !== undefined && !input.title.trim()) {
    throw new AppError(400, 'title cannot be empty');
  }
  if (input.content !== undefined && !input.content.trim()) {
    throw new AppError(400, 'content cannot be empty');
  }

  return prisma.announcement.update({
    where: { id },
    data: {
      ...(input.title !== undefined && { title: input.title.trim() }),
      ...(input.content !== undefined && { content: input.content.trim() }),
      ...(input.expires_at !== undefined && { expires_at: input.expires_at }),
      ...(input.is_active !== undefined && { is_active: input.is_active }),
    },
  });
}

export async function deleteAnnouncement(id: string) {
  await getAnnouncementById(id);
  await prisma.announcement.delete({ where: { id } });
}