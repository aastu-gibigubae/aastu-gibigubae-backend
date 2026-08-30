import prisma from "../models/prisma.js";

import {
  CreateSubKiflatInput,
  SubKiflatQuery,
  UpdateSubKiflatInput,
} from "../models/subkiflat.model";



export const createSubKiflat = async (
  data: CreateSubKiflatInput,
) => {
  try {
    // Verify parent Kiflat exists
    

    const kiflat =
      await prisma.kiflat.findUnique({
        where: {
          id: data.kiflatId,
        },
      });

    if (!kiflat) {
      const error = new Error(
        "Parent Kiflat not found",
      );

      (error as any).statusCode = 404;

      throw error;
    }

    return await prisma.subKiflat.create({
      data: {
        kiflat_id: data.kiflatId,
        name: data.name,
        description: data.description,
        image_url: data.imageUrl,
      },
    });
  } catch (error) {
    console.error(
      "Sub-Kiflat creation failed:",
      error,
    );

    throw error;
  }
};


//GET SUB-KIFLATS

//  Supports:
//  - Search
//  - Pagination
//  - Parent Kiflat filter
//  - Sorting


export const getSubKiflats = async (
  query: SubKiflatQuery,
) => {
  try {
    const {
      page,
      limit,
      search,
      kiflatId,
      sortBy,
      sortOrder,
    } = query;

    const skip = (page - 1) * limit;

    const where = {
      ...(kiflatId && {
        kiflat_id: kiflatId,
      }),

      ...(search
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
        : {}),
    };

    const [subKiflats, total] =
      await prisma.$transaction([
        prisma.subKiflat.findMany({
          where,

          include: {
            kiflat: {
              select: {
                id: true,
                name: true,
              },
            },
          },

          orderBy: {
            [sortBy]: sortOrder,
          },

          skip,
          take: limit,
        }),

        prisma.subKiflat.count({
          where,
        }),
      ]);

    return {
      subKiflats,

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
      "Getting Sub-Kiflats failed:",
      error,
    );

    throw error;
  }
};


//GET SUB-KIFLAT BY ID


export const getSubKiflatById = async (
  id: string,
) => {
  try {
    return await prisma.subKiflat.findUnique({
      where: {
        id,
      },

      include: {
        kiflat: {
          select: {
            id: true,
            name: true,
            description: true,
            image_url: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(
      "Getting Sub-Kiflat failed:",
      error,
    );

    throw error;
  }
};


// UPDATE SUB-KIFLAT


export const updateSubKiflat = async (
  id: string,
  data: UpdateSubKiflatInput,
) => {
  try {
    //If changing parent Kiflat, verify it exists.
    

    if (data.kiflatId) {
      const kiflat =
        await prisma.kiflat.findUnique({
          where: {
            id: data.kiflatId,
          },
        });

      if (!kiflat) {
        const error = new Error(
          "Parent Kiflat not found",
        );

        (error as any).statusCode = 404;

        throw error;
      }
    }

    return await prisma.subKiflat.update({
      where: {
        id,
      },

      data: {
        ...(data.kiflatId !== undefined && {
          kiflat_id: data.kiflatId,
        }),

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
      "Updating Sub-Kiflat failed:",
      error,
    );

    throw error;
  }
};


//DELETE SUB-KIFLAT


export const deleteSubKiflat = async (
  id: string,
) => {
  try {
    return await prisma.subKiflat.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(
      "Deleting Sub-Kiflat failed:",
      error,
    );

    throw error;
  }
};