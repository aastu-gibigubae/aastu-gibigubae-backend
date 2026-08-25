import Joi from "joi";

export const createEventSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(150)
    .required()
    .messages({
      "string.empty": "Title is required",
      "any.required": "Title is required",
      "string.max": "Title must not exceed 150 characters",
    }),

  description: Joi.string()
    .trim()
    .min(1)
    .max(5000)
    .required()
    .messages({
      "string.empty": "Description is required",
      "any.required": "Description is required",
      "string.max":
        "Description must not exceed 5000 characters",
    }),

  imageUrl: Joi.string()
    .trim()
    .uri({
      scheme: ["http", "https"],
    })
    .max(2000)
    .allow(null, "")
    .optional()
    .messages({
      "string.uri":
        "Image URL must be a valid HTTP or HTTPS URL",
      "string.max":
        "Image URL must not exceed 2000 characters",
    }),

  location: Joi.string()
    .trim()
    .min(1)
    .max(250)
    .required()
    .messages({
      "string.empty": "Location is required",
      "any.required": "Location is required",
      "string.max":
        "Location must not exceed 250 characters",
    }),

  eventDate: Joi.date()
    .iso()
    .required()
    .messages({
      "date.base": "Event date must be a valid date",
      "date.format": "Event date must be a valid ISO date",
      "any.required": "Event date is required",
    }),

  isPublished: Joi.boolean()
    .default(false)
    .optional()
    .messages({
      "boolean.base": "isPublished must be a boolean",
    }),

  createdBy: Joi.string()
    .guid({
      version: ["uuidv4"],
    })
    .required()
    .messages({
      "string.guid": "createdBy must be a valid UUID",
      "any.required": "createdBy is required",
    }),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

export const updateEventSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(150)
    .messages({
      "string.empty": "Title cannot be empty",
      "string.max": "Title must not exceed 150 characters",
    }),

  description: Joi.string()
    .trim()
    .min(1)
    .max(5000)
    .messages({
      "string.empty": "Description cannot be empty",
      "string.max":
        "Description must not exceed 5000 characters",
    }),

  imageUrl: Joi.string()
    .trim()
    .uri({
      scheme: ["http", "https"],
    })
    .max(2000)
    .allow(null, "")
    .messages({
      "string.uri":
        "Image URL must be a valid HTTP or HTTPS URL",
      "string.max":
        "Image URL must not exceed 2000 characters",
    }),

  location: Joi.string()
    .trim()
    .min(1)
    .max(250)
    .messages({
      "string.empty": "Location cannot be empty",
      "string.max":
        "Location must not exceed 250 characters",
    }),

  eventDate: Joi.date()
    .iso()
    .messages({
      "date.base": "Event date must be a valid date",
      "date.format": "Event date must be a valid ISO date",
    }),

  isPublished: Joi.boolean()
    .messages({
      "boolean.base": "isPublished must be a boolean",
    }),
})
  .min(1)
  .options({
    abortEarly: false,
    stripUnknown: true,
  });

export const eventIdSchema = Joi.object({
  id: Joi.string()
    .guid({
      version: ["uuidv4"],
    })
    .required()
    .messages({
      "string.guid": "Event ID must be a valid UUID",
      "any.required": "Event ID is required",
    }),
});