import prisma from "../models/prisma.js";

import {
  CreateKiflatInput,
  KiflatQuery,
  UpdateKiflatInput,
} from "../models/kiflat.model.js";


export const createKiflat = async (
  data: CreateKiflatInput,
) => {
  try {
    return await prisma.kiflat.create({
      data: {
        name: data.name,
        description: data.description,
        image_url: data.imageUrl,
      },
    });
  } catch (error) {
    console.error(
      "Kiflat creation failed:",
      error,
    );

    throw error;
  }
};
//GET KIFLATS

//  Supports:
//  - Search
//  - Pagination
//  - Parent Kiflat filter
//  - Sorting

export const getKiflats = async (
  query: KiflatQuery,
) => {
  try {
    const {
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    } = query;

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },

            {
              description: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {};

    const [kiflats, total] =
      await prisma.$transaction([
        prisma.kiflat.findMany({
          where,

          select: {
            id: true,
            name: true,
            description: true,
            image_url: true,
            created_at: true,
            updated_at: true,

            _count: {
              select: {
                sub_kiflat: true,
              },
            },
          },

          orderBy: {
            [sortBy]: sortOrder,
          },

          skip,
          take: limit,
        }),

        prisma.kiflat.count({
          where,
        }),
      ]);

    return {
      kiflats,

      pagination: {
        page,
        limit,
        total,
        totalPages:
          Math.ceil(total / limit),

        hasNextPage:
          page <
          Math.ceil(total / limit),

        hasPreviousPage:
          page > 1,
      },
    };
  } catch (error) {
    console.error(
      "Getting Kiflats failed:",
      error,
    );

    throw error;
  }
};


//PUBLIC - GET KIFLAT BY ID
// Includes all sub-kiflats belonging to it.

export const getKiflatById = async (
  id: string,
) => {
  try {
    return await prisma.kiflat.findUnique({
      where: {
        id,
      },

      include: {
        sub_kiflat: {
          orderBy: {
            name: "asc",
          },
        },
      },
    });
  } catch (error) {
    console.error(
      "Getting Kiflat failed:",
      error,
    );

    throw error;
  }
};

export const updateKiflat = async (
  id: string,
  data: UpdateKiflatInput,
) => {
  try {
    return await prisma.kiflat.update({
      where: {
        id,
      },

      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),

        ...(data.description !== undefined && {
          description: data.description,
        }),

        ...(data.imageUrl !== undefined && {
          image_url: data.imageUrl,
        }),
      },
    });
  } catch (error) {
    console.error(
      "Updating Kiflat failed:",
      error,
    );

    throw error;
  }
};


//DELETE KIFLAT
//all associated sub-kiflats will also be deleted.


export const deleteKiflat = async (
  id: string,
) => {
  try {
    return await prisma.kiflat.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(
      "Deleting Kiflat failed:",
      error,
    );

    throw error;
  }
};