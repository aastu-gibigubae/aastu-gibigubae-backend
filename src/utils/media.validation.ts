import Joi from "joi";

const VALID_MEDIA_TYPES = ["IMAGE", "VIDEO", "AUDIO", "DOCUMENT"] as const;

//a validation schema to create a media item
export const createMediaItemSchema = Joi.object({
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

  description: Joi.string()
    .trim()
    .max(5000)
    .allow(null, "")
    .optional()
    .messages({
      "string.max": "Description must not exceed 5000 characters",
    }),

  media_url: Joi.string()
    .trim()
    .uri({ scheme: ["http", "https"] })
    .max(2000)
    .required()
    .messages({
      "string.empty": "Media URL is required",
      "any.required": "Media URL is required",
      "string.uri": "Media URL must be a valid HTTP or HTTPS URL",
      "string.max": "Media URL must not exceed 2000 characters",
    }),

  thumbnail_url: Joi.string()
    .trim()
    .uri({ scheme: ["http", "https"] })
    .max(2000)
    .allow(null, "")
    .optional()
    .messages({
      "string.uri": "Thumbnail URL must be a valid HTTP or HTTPS URL",
      "string.max": "Thumbnail URL must not exceed 2000 characters",
    }),

  media_type: Joi.string()
    .valid(...VALID_MEDIA_TYPES)
    .required()
    .messages({
      "any.required": "Media type is required",
      "any.only": `Media type must be one of: ${VALID_MEDIA_TYPES.join(", ")}`,
    }),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

//validation schema to update media
export const updateMediaItemSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .optional()
    .messages({
      "string.empty": "Title cannot be empty",
      "string.max": "Title must not exceed 255 characters",
    }),

  description: Joi.string()
    .trim()
    .max(5000)
    .allow(null, "")
    .optional()
    .messages({
      "string.max": "Description must not exceed 5000 characters",
    }),

  media_url: Joi.string()
    .trim()
    .uri({ scheme: ["http", "https"] })
    .max(2000)
    .optional()
    .messages({
      "string.uri": "Media URL must be a valid HTTP or HTTPS URL",
      "string.max": "Media URL must not exceed 2000 characters",
    }),

  thumbnail_url: Joi.string()
    .trim()
    .uri({ scheme: ["http", "https"] })
    .max(2000)
    .allow(null, "")
    .optional()
    .messages({
      "string.uri": "Thumbnail URL must be a valid HTTP or HTTPS URL",
      "string.max": "Thumbnail URL must not exceed 2000 characters",
    }),

  media_type: Joi.string()
    .valid(...VALID_MEDIA_TYPES)
    .optional()
    .messages({
      "any.only": `Media type must be one of: ${VALID_MEDIA_TYPES.join(", ")}`,
    }),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

/*
|--------------------------------------------------------------------------
| ID PARAM — reused for GET /:id, PATCH /:id, DELETE /:id
|--------------------------------------------------------------------------
*/
export const mediaItemIdSchema = Joi.object({
  id: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required()
    .messages({
      "string.guid": "Media item ID must be a valid UUID",
      "any.required": "Media item ID is required",
    }),
});

//validation schema for queries
export const mediaItemQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),

  limit: Joi.number().integer().min(1).max(50).default(10),

  search: Joi.string().trim().max(200).optional(),

  media_type: Joi.string()
    .valid(...VALID_MEDIA_TYPES)
    .optional()
    .messages({
      "any.only": `media_type must be one of: ${VALID_MEDIA_TYPES.join(", ")}`,
    }),

  fromDate: Joi.date()
    .iso()
    .optional()
    .messages({ "date.format": "fromDate must be a valid ISO date" }),

  toDate: Joi.date()
    .iso()
    .optional()
    .messages({ "date.format": "toDate must be a valid ISO date" }),

  sortBy: Joi.string()
    .valid("created_at", "title")
    .default("created_at"),

  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
})
  .custom((value, helpers) => {
    if (value.fromDate && value.toDate && value.fromDate > value.toDate) {
      return helpers.error("date.range");
    }
    return value;
  })
  .messages({ "date.range": "fromDate cannot be later than toDate" })
  .options({
    abortEarly: false,
    stripUnknown: true,
  });
