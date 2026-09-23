import prisma from "../models/prisma.js";
import { AppError } from "../utils/appError.js";
import {
  CreateMediaItemInput,
  MediaItemQuery,
  UpdateMediaItemInput,
} from "../models/media.model.js";

//create media service
export const createMediaItem = async (data: CreateMediaItemInput) => {
  try {
    return await prisma.mediaItem.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        media_url: data.media_url,
        thumbnail_url: data.thumbnail_url ?? null,
        media_type: data.media_type,
        userId: data.userId,
      },
    });
  } catch (error) {
    console.error("Media item creation failed:", error);
    throw error;
  }
};

//list all medias service
export const getAllMediaItems = async (query: MediaItemQuery) => {
  const { page, limit, search, media_type, fromDate, toDate, sortBy, sortOrder } =
    query;

  const skip = (page - 1) * limit;

  const where = {
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),

    ...(media_type ? { media_type } : {}),

    ...(fromDate || toDate
      ? {
          created_at: {
            ...(fromDate && { gte: fromDate }),
            ...(toDate && { lte: toDate }),
          },
        }
      : {}),
  };

  const [mediaItems, total] = await prisma.$transaction([
    prisma.mediaItem.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.mediaItem.count({ where }),
  ]);

  return {
    data: mediaItems,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    },
  };
};

//search media by id service
export const getMediaItemById = async (id: string) => {
  try {
    const mediaItem = await prisma.mediaItem.findUnique({ where: { id } });

    if (!mediaItem) {
      throw new AppError(404, `Media item with id '${id}' not found`);
    }

    return mediaItem;
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Getting media item failed:", error);
    throw error;
  }
};

//update media service
export const updateMediaItem = async (
  id: string,
  data: UpdateMediaItemInput,
) => {
  try {
    // Verify the record exists first
    await getMediaItemById(id);

    return await prisma.mediaItem.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.media_url !== undefined && { media_url: data.media_url }),
        ...(data.thumbnail_url !== undefined && {
          thumbnail_url: data.thumbnail_url,
        }),
        ...(data.media_type !== undefined && { media_type: data.media_type }),
      },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Updating media item failed:", error);
    throw error;
  }
};

//delete media service
export const deleteMediaItem = async (id: string) => {
  try {
    await getMediaItemById(id);
    return await prisma.mediaItem.delete({ where: { id } });
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Deleting media item failed:", error);
    throw error;
  }
};
