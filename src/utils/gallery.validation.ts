import Joi from "joi";

/**
 * Validation schema for creating a GalleryImage.
 * The client provides the image URL directly in the JSON body.
 */
export const createGallerySchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .required()
    .messages({
      "string.empty": "Title is required",
      "any.required": "Title is required",
      "string.max": "Title must not exceed 255 characters",
    }),

  image_url: Joi.string()
    .trim()
    .uri()
    .required()
    .messages({
      "string.empty": "Image URL is required",
      "any.required": "Image URL is required",
      "string.uri": "Image URL must be a valid URL",
    }),

  description: Joi.string()
    .trim()
    .max(2000)
    .allow(null, "")
    .optional()
    .messages({
      "string.max": "Description must not exceed 2000 characters",
    }),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

/**
 * Validation schema for updating a GalleryImage.
 * All fields are optional, but at least one must be provided (checked in controller).
 */
export const updateGallerySchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .optional()
    .messages({
      "string.empty": "Title cannot be empty",
      "string.max": "Title must not exceed 255 characters",
    }),

  image_url: Joi.string()
    .trim()
    .uri()
    .optional()
    .messages({
      "string.uri": "Image URL must be a valid URL",
    }),

  description: Joi.string()
    .trim()
    .max(2000)
    .allow(null, "")
    .optional()
    .messages({
      "string.max": "Description must not exceed 2000 characters",
    }),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

/**
 * Validation schema for route parameters that carry a GalleryImage UUID.
 */
export const galleryIdParamSchema = Joi.object({
  id: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required()
    .messages({
      "string.guid": "Gallery image ID must be a valid UUID",
      "any.required": "Gallery image ID is required",
    }),
});
