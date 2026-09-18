import Joi from "joi";

export const createMagazineSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .required()
    .messages({
      "string.empty": "Title is required",
      "any.required": "Title is required",
      "string.max":
        "Title must not exceed 200 characters",
    }),

  coverImage: Joi.string()
    .trim()
    .uri({
      scheme: ["http", "https"],
    })
    .max(2000)
    .allow(null, "")
    .optional()
    .messages({
      "string.uri":
        "Cover image URL must be a valid HTTP or HTTPS URL",
      "string.max":
        "Cover image URL must not exceed 2000 characters",
    }),

  content: Joi.string()
    .trim()
    .max(50000)
    .allow(null, "")
    .optional()
    .messages({
      "string.max":
        "Content must not exceed 50000 characters",
    }),

  pdfUrl: Joi.string()
    .trim()
    .uri({
      scheme: ["http", "https"],
    })
    .max(2000)
    .required()
    .messages({
      "string.empty": "PDF URL is required",
      "any.required": "PDF URL is required",
      "string.uri":
        "PDF URL must be a valid HTTP or HTTPS URL",
      "string.max":
        "PDF URL must not exceed 2000 characters",
    }),

  userId: Joi.string()
    .guid({
      version: ["uuidv4"],
    })
    .required()
    .messages({
      "string.guid":
        "userId must be a valid UUID",
      "any.required":
        "userId is required",
    }),
}).options({
  abortEarly: false,
  stripUnknown: true,
});


export const updateMagazineSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .messages({
      "string.empty":
        "Title cannot be empty",
      "string.max":
        "Title must not exceed 200 characters",
    }),

  coverImage: Joi.string()
    .trim()
    .uri({
      scheme: ["http", "https"],
    })
    .max(2000)
    .allow(null, "")
    .messages({
      "string.uri":
        "Cover image URL must be a valid HTTP or HTTPS URL",
      "string.max":
        "Cover image URL must not exceed 2000 characters",
    }),

  content: Joi.string()
    .trim()
    .max(50000)
    .allow(null, "")
    .messages({
      "string.max":
        "Content must not exceed 50000 characters",
    }),

  pdfUrl: Joi.string()
    .trim()
    .uri({
      scheme: ["http", "https"],
    })
    .max(2000)
    .messages({
      "string.uri":
        "PDF URL must be a valid HTTP or HTTPS URL",
      "string.max":
        "PDF URL must not exceed 2000 characters",
    }),
})
  .min(1)
  .options({
    abortEarly: false,
    stripUnknown: true,
  });


export const magazineIdSchema = Joi.object({
  id: Joi.string()
    .guid({
      version: ["uuidv4"],
    })
    .required()
    .messages({
      "string.guid":
        "Magazine ID must be a valid UUID",
      "any.required":
        "Magazine ID is required",
    }),
});



export const magazineQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .default(10),

  search: Joi.string()
    .trim()
    .max(200)
    .optional(),

  fromDate: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.format":
        "fromDate must be a valid ISO date",
    }),

  toDate: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.format":
        "toDate must be a valid ISO date",
    }),

  sortBy: Joi.string()
    .valid("published_at", "title")
    .default("published_at"),

  sortOrder: Joi.string()
    .valid("asc", "desc")
    .default("desc"),
})
  .custom((value, helpers) => {
    if (
      value.fromDate &&
      value.toDate &&
      value.fromDate > value.toDate
    ) {
      return helpers.error(
        "date.range",
      );
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