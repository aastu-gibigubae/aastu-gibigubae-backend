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

export const getPublishedEvents = async (query: EventQuery) => {
  try {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(Math.max(query.limit ?? 10, 1), 50);
    const skip = (page - 1) * limit;

    const [events, total] = await prisma.$transaction([
      prisma.event.findMany({
        where: {
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
        orderBy: {
          event_date: "asc",
        },
        skip,
        take: limit,
      }),

      prisma.event.count({
        where: {
          is_published: true,
        },
      }),
    ]);

    return {
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Getting published events failed:", error);
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

export const getAllEvents = async (query: EventQuery) => {
  try {
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(Math.max(query.limit ?? 10, 1), 50);
    const skip = (page - 1) * limit;

    const [events, total] = await prisma.$transaction([
      prisma.event.findMany({
        orderBy: {
          event_date: "asc",
        },
        skip,
        take: limit,
      }),

      prisma.event.count(),
    ]);

    return {
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Getting all events failed:", error);
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