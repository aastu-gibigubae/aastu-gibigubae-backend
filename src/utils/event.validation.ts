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

export const eventQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      "number.base": "Page must be a number",
      "number.integer": "Page must be an integer",
      "number.min": "Page must be at least 1",
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .default(10)
    .messages({
      "number.base": "Limit must be a number",
      "number.integer": "Limit must be an integer",
      "number.min": "Limit must be at least 1",
      "number.max": "Limit must not exceed 50",
    }),

  search: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .optional()
    .messages({
      "string.empty": "Search cannot be empty",
      "string.max": "Search must not exceed 200 characters",
    }),

  fromDate: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.base": "fromDate must be a valid date",
      "date.format": "fromDate must be a valid ISO date",
    }),

  toDate: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.base": "toDate must be a valid date",
      "date.format": "toDate must be a valid ISO date",
    }),

  sortBy: Joi.string()
    .valid(
      "event_date",
      "title",
      "created_at",
    )
    .default("event_date")
    .messages({
      "any.only":
        "sortBy must be event_date, title, or created_at",
    }),

  sortOrder: Joi.string()
    .valid("asc", "desc")
    .default("asc")
    .messages({
      "any.only":
        "sortOrder must be asc or desc",
    }),
})
  .custom((value, helpers) => {
    if (
      value.fromDate &&
      value.toDate &&
      value.fromDate > value.toDate
    ) {
      return helpers.error("date.range");
    }

    return value;
  })
  .messages({
    "date.range":
      "fromDate cannot be later than toDate",
  })
  .options({
    abortEarly: false,
    stripUnknown: true,
  });