import prisma from "../models/prisma.js";

import {
  CreateMagazineInput,
  MagazineQuery,
  UpdateMagazineInput,
} from "../models/magazine.model.js";


export const createMagazine = async (
  data: CreateMagazineInput,
) => {
  return prisma.magazine.create({
    data: {
      title: data.title,

      cover_image_url:
        data.coverImageUrl ?? null,

      content:
        data.content ?? null,

      file_url:
        data.fileUrl,

      created_by:
        data.createdBy,
    },
  });
};


// PUBLIC MAGAZINES


export const getPublishedMagazines = async (
  query: MagazineQuery,
) => {
  const {
    page,
    limit,
    search,
    fromDate,
    toDate,
    sortBy,
    sortOrder,
  } = query;

  const skip = (page - 1) * limit;

  const where = {
    ...(search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              content: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),

    ...(fromDate || toDate
      ? {
          published_at: {
            ...(fromDate && {
              gte: fromDate,
            }),

            ...(toDate && {
              lte: toDate,
            }),
          },
        }
      : {}),
  };

  const [magazines, total] =
    await prisma.$transaction([
      prisma.magazine.findMany({
        where,

        skip,

        take: limit,

        select: {
          id: true,
          title: true,
          cover_image_url: true,
          content: true,
          file_url: true,
          published_at: true,
          updated_at: true,
        },

        orderBy: {
          [sortBy]: sortOrder,
        },
      }),

      prisma.magazine.count({
        where,
      }),
    ]);

  return {
    data: magazines,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(
        total / limit,
      ),
      hasNextPage:
        page < Math.ceil(total / limit),
      hasPreviousPage:
        page > 1,
    },
  };
};


//PUBLIC MAGAZINE BY ID


export const getPublishedMagazineById = async (
  id: string,
) => {
  return prisma.magazine.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      title: true,
      cover_image_url: true,
      content: true,
      file_url: true,
      published_at: true,
      updated_at: true,
    },
  });
};


//ADMIN - ALL MAGAZINES


export const getAllMagazines = async (
  query: MagazineQuery,
) => {
  const {
    page,
    limit,
    search,
    fromDate,
    toDate,
    sortBy,
    sortOrder,
  } = query;

  const skip = (page - 1) * limit;

  const where = {
    ...(search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              content: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),

    ...(fromDate || toDate
      ? {
          published_at: {
            ...(fromDate && {
              gte: fromDate,
            }),

            ...(toDate && {
              lte: toDate,
            }),
          },
        }
      : {}),
  };

  const [magazines, total] =
    await prisma.$transaction([
      prisma.magazine.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          [sortBy]: sortOrder,
        },
      }),

      prisma.magazine.count({
        where,
      }),
    ]);

  return {
    data: magazines,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(
        total / limit,
      ),
      hasNextPage:
        page < Math.ceil(total / limit),
      hasPreviousPage:
        page > 1,
    },
  };
};


export const getMagazineById = async (
  id: string,
) => {
  return prisma.magazine.findUnique({
    where: {
      id,
    },
  });
};


export const updateMagazine = async (
  id: string,
  data: UpdateMagazineInput,
) => {
  return prisma.magazine.update({
    where: {
      id,
    },

    data: {
      ...(data.title !== undefined && {
        title: data.title,
      }),

      ...(data.coverImageUrl !== undefined && {
        cover_image_url:
          data.coverImageUrl,
      }),

      ...(data.content !== undefined && {
        content:
          data.content,
      }),

      ...(data.fileUrl !== undefined && {
        file_url:
          data.fileUrl,
      }),
    },
  });
};


export const deleteMagazine = async (
  id: string,
) => {
  return prisma.magazine.delete({
    where: {
      id,
    },
  });
};