import prisma from "../models/prisma.js";
import { AppError } from "../utils/appError.js";

export interface CreateGalleryInput {
  title: string;
  description?: string | null;
  image_url: string;
  uploaded_by: string;
}

export interface UpdateGalleryInput {
  title?: string;
  description?: string | null;
  image_url?: string;
}

/*
|--------------------------------------------------------------------------
| CREATE GALLERY IMAGE
| Stores the user-provided image URL directly in the DB record.
|--------------------------------------------------------------------------
*/

export const createGallery = async (data: CreateGalleryInput) => {
  try {
    return await prisma.galleryImage.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        image_url: data.image_url,
        uploaded_by: data.uploaded_by,
      },
    });
  } catch (error) {
    console.error("Gallery image creation failed:", error);
    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| GET ALL GALLERY IMAGES
|--------------------------------------------------------------------------
*/

export const getGalleries = async () => {
  try {
    return await prisma.galleryImage.findMany({
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error("Getting gallery images failed:", error);
    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| GET GALLERY IMAGE BY ID
|--------------------------------------------------------------------------
*/

export const getGalleryById = async (id: string) => {
  try {
    const gallery = await prisma.galleryImage.findUnique({ where: { id } });

    if (!gallery) {
      throw new AppError(404, `Gallery image with id '${id}' not found`);
    }

    return gallery;
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Getting gallery image failed:", error);
    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE GALLERY IMAGE
| Updates title, description, and/or image_url directly.
|--------------------------------------------------------------------------
*/

export const updateGallery = async (id: string, data: UpdateGalleryInput) => {
  try {
    // Verify the record exists
    await getGalleryById(id);

    return await prisma.galleryImage.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.image_url !== undefined && { image_url: data.image_url }),
      },
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Updating gallery image failed:", error);
    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| DELETE GALLERY IMAGE
| Removes the DB record. No external storage cleanup needed.
|--------------------------------------------------------------------------
*/

export const deleteGallery = async (id: string) => {
  try {
    await getGalleryById(id);

    return await prisma.galleryImage.delete({ where: { id } });
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Deleting gallery image failed:", error);
    throw error;
  }
};
