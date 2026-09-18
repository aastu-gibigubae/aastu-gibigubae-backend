import { Request, Response } from 'express';
import * as announcementService from '../services/announcement.service.js';
import { AppError } from '../utils/appError.js';

function getIdParam(req: Request): string {
  const { id } = req.params;
  if (typeof id !== 'string') {
    throw new AppError(400, 'Invalid id parameter');
  }
  return id;
}

export async function listAnnouncements(_req: Request, res: Response) {
  const announcements = await announcementService.listActiveAnnouncements();
  res.json(announcements);
}

export async function getAnnouncement(req: Request, res: Response) {
  const announcement = await announcementService.getAnnouncementById(getIdParam(req), true);
  res.json(announcement);
}

export async function getAnnouncementAdmin(req: Request, res: Response) {
  const announcement = await announcementService.getAnnouncementById(getIdParam(req), false);
  res.json(announcement);
}

export async function createAnnouncement(req: Request, res: Response) {
  const { title, content, expires_at, is_active, userId } = req.body;
  const announcement = await announcementService.createAnnouncement({
    title,
    content,
    expires_at: new Date(expires_at),
    is_active,
    userId,
  });
  res.status(201).json(announcement);
}

export async function updateAnnouncement(req: Request, res: Response) {
  const { title, content, expires_at, is_active } = req.body;
  const announcement = await announcementService.updateAnnouncement(getIdParam(req), {
    title,
    content,
    expires_at: expires_at === undefined ? undefined : new Date(expires_at),
    is_active,
  });
  res.json(announcement);
}

export async function deleteAnnouncement(req: Request, res: Response) {
  await announcementService.deleteAnnouncement(getIdParam(req));
  res.status(204).send();
}