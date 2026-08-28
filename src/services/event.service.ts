import prisma from "../models/prisma.js";
import {
  CreateEventInput,
  EventQuery,
  UpdateEventInput,
} from "../models/event.model.js";

export const createEvent = async (data: CreateEventInput) => {
  try {
    return await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        image_url: data.imageUrl,
        location: data.location,
        event_date: new Date(data.eventDate),
        is_published: data.isPublished ?? false,
        created_by: data.createdBy,
      },
    });
  } catch (error) {
    console.error("Event creation failed:", error);
    throw error;
  }
};

export const getPublishedEvents = async (
  query: EventQuery,
) => {
  try {
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
      // Public users can only see published events
      is_published: true,
      //search
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
                description: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },

              {
                location: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),

      // DATE FILTER
      

      ...(fromDate || toDate
        ? {
            event_date: {
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

    // GET EVENTS + TOTAL COUNT
    

    const [events, total] =
      await prisma.$transaction([
        prisma.event.findMany({
          where,

          select: {
            id: true,
            title: true,
            description: true,
            image_url: true,
            location: true,
            event_date: true,
            is_published: true,
            created_at: true,
            updated_at: true,
          },

          orderBy: {
            [sortBy]: sortOrder,
          },

          skip,
          take: limit,
        }),

        prisma.event.count({
          where,
        }),
      ]);

    return {
      events,

      pagination: {
        page,
        limit,
        total,

        totalPages:
          Math.ceil(total / limit),

        hasNextPage:
          page < Math.ceil(total / limit),

        hasPreviousPage:
          page > 1,
      },
    };
  } catch (error) {
    console.error(
      "Getting published events failed:",
      error,
    );

    throw error;
  }
};

export const getPublishedEventById = async (id: string) => {
  try {
    return await prisma.event.findFirst({
      where: {
        id,
        is_published: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        image_url: true,
        location: true,
        event_date: true,
        is_published: true,
        created_at: true,
        updated_at: true,
      },
    });
  } catch (error) {
    console.error("Getting published event failed:", error);
    throw error;
  }
};

export const getAllEvents = async (
  query: EventQuery,
) => {
  try {
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
   
        //search
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
                description: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },

              {
                location: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),

      //DATE FILTER
     

      ...(fromDate || toDate
        ? {
            event_date: {
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

   //GET EVENTS + TOTAL COUNT
   

    const [events, total] =
      await prisma.$transaction([
        prisma.event.findMany({
          where,

          orderBy: {
            [sortBy]: sortOrder,
          },

          skip,
          take: limit,
        }),

        prisma.event.count({
          where,
        }),
      ]);

    return {
      events,

      pagination: {
        page,
        limit,
        total,

        totalPages:
          Math.ceil(total / limit),

        hasNextPage:
          page < Math.ceil(total / limit),

        hasPreviousPage:
          page > 1,
      },
    };
  } catch (error) {
    console.error(
      "Getting all events failed:",
      error,
    );

    throw error;
  }
};

export const getEventById = async (id: string) => {
  try {
    return await prisma.event.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("Getting event failed:", error);
    throw error;
  }
};

export const updateEvent = async (
  id: string,
  data: UpdateEventInput,
) => {
  try {
    return await prisma.event.update({
      where: {
        id,
      },
      data: {
        ...(data.title !== undefined && {
          title: data.title,
        }),

        ...(data.description !== undefined && {
          description: data.description,
        }),

        ...(data.imageUrl !== undefined && {
          image_url: data.imageUrl,
        }),

        ...(data.location !== undefined && {
          location: data.location,
        }),

        ...(data.eventDate !== undefined && {
          event_date: new Date(data.eventDate),
        }),

        ...(data.isPublished !== undefined && {
          is_published: data.isPublished,
        }),
      },
    });
  } catch (error) {
    console.error("Updating event failed:", error);
    throw error;
  }
};

export const deleteEvent = async (id: string) => {
  try {
    return await prisma.event.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("Deleting event failed:", error);
    throw error;
  }
};