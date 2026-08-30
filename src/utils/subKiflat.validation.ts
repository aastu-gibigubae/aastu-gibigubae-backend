import Joi from "joi";

export const createSubKiflatSchema =
  Joi.object({
    kiflatId: Joi.string()
      .guid({
        version: ["uuidv4"],
      })
      .required()
      .messages({
        "string.guid":
          "Kiflat ID must be a valid UUID",

        "any.required":
          "Kiflat ID is required",
      }),

    name: Joi.string()
      .trim()
      .min(1)
      .max(150)
      .required()
      .messages({
        "string.empty":
          "Name is required",

        "any.required":
          "Name is required",

        "string.max":
          "Name must not exceed 150 characters",
      }),

    description: Joi.string()
      .trim()
      .max(5000)
      .allow(null, "")
      .optional()
      .messages({
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
  }).options({
    abortEarly: false,
    stripUnknown: true,
  });

export const updateSubKiflatSchema =
  Joi.object({
    kiflatId: Joi.string()
      .guid({
        version: ["uuidv4"],
      })
      .messages({
        "string.guid":
          "Kiflat ID must be a valid UUID",
      }),

    name: Joi.string()
      .trim()
      .min(1)
      .max(150)
      .messages({
        "string.empty":
          "Name cannot be empty",

        "string.max":
          "Name must not exceed 150 characters",
      }),

    description: Joi.string()
      .trim()
      .max(5000)
      .allow(null, "")
      .messages({
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
  })
    .min(1)
    .options({
      abortEarly: false,
      stripUnknown: true,
    });


// SUB-KIFLAT ID


export const subKiflatIdSchema =
  Joi.object({
    id: Joi.string()
      .guid({
        version: ["uuidv4"],
      })
      .required()
      .messages({
        "string.guid":
          "Sub-Kiflat ID must be a valid UUID",

        "any.required":
          "Sub-Kiflat ID is required",
      }),
  });


//SUB-KIFLAT QUERY
//  Supports:
//  - Search
//  - Pagination
//  - Parent Kiflat filter
//  - Sorting


export const subKiflatQuerySchema =
  Joi.object({
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
      .min(1)
      .max(200)
      .optional(),

    kiflatId: Joi.string()
      .guid({
        version: ["uuidv4"],
      })
      .optional()
      .messages({
        "string.guid":
          "Kiflat ID must be a valid UUID",
      }),

    sortBy: Joi.string()
      .valid(
        "name",
        "created_at",
        "updated_at",
      )
      .default("name"),

    sortOrder: Joi.string()
      .valid("asc", "desc")
      .default("asc"),
  })
    .options({
      abortEarly: false,
      stripUnknown: true,
    });