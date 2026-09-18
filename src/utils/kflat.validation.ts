import Joi from "joi";

export const createKiflatSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(150)
    .required()
    .messages({
      "string.empty": "Name is required",
      "any.required": "Name is required",
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

  imageUrls: Joi.array()
    .items(
      Joi.string()
        .trim()
        .uri({ scheme: ["http", "https"] })
        .max(2000)
    )
    .optional()
    .messages({
      "array.base": "Image URLs must be an array of strings",
      "string.uri": "Each image URL must be a valid HTTP or HTTPS URL",
      "string.max": "Each image URL must not exceed 2000 characters",
    }),
}).options({
  abortEarly: false,
  stripUnknown: true,
});


//UPDATE KIFLAT


export const updateKiflatSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(150)
    .messages({
      "string.empty": "Name cannot be empty",

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

  imageUrls: Joi.array()
    .items(
      Joi.string()
        .trim()
        .uri({ scheme: ["http", "https"] })
        .max(2000)
    )
    .optional()
    .messages({
      "array.base": "Image URLs must be an array of strings",
      "string.uri": "Each image URL must be a valid HTTP or HTTPS URL",
      "string.max": "Each image URL must not exceed 2000 characters",
    }),
})
  .min(1)
  .options({
    abortEarly: false,
    stripUnknown: true,
  });


//KIFLAT ID


export const kiflatIdSchema = Joi.object({
  id: Joi.string()
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
});


/*
 KIFLAT QUERY

 Supports:
 - Search
 - Pagination
 - Sorting

*/

export const kiflatQuerySchema = Joi.object({
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
      "number.max":
        "Limit must not exceed 50",
    }),

  search: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .optional()
    .messages({
      "string.empty":
        "Search cannot be empty",

      "string.max":
        "Search must not exceed 200 characters",
    }),

  sortBy: Joi.string()
    .valid(
      "name",
      "created_at",
      "updated_at",
    )
    .default("name")
    .messages({
      "any.only":
        "sortBy must be name, created_at, or updated_at",
    }),

  sortOrder: Joi.string()
    .valid("asc", "desc")
    .default("asc")
    .messages({
      "any.only":
        "sortOrder must be asc or desc",
    }),
}).options({
  abortEarly: false,
  stripUnknown: true,
});