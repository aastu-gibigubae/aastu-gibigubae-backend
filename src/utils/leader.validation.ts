import Joi from 'joi';

/**
 * Validation schema for creating a Leader.
 * All required fields must be present; profile_image_url is optional.
 */
export const createLeaderSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required(),
  role: Joi.string().trim().min(1).max(255).required(),
  biography: Joi.string().trim().min(1).required(),
  profile_image_url: Joi.string().uri().optional(),
});

/**
 * Validation schema for updating a Leader.
 * All fields are optional; at least one must be provided.
 */
export const updateLeaderSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).optional(),
  role: Joi.string().trim().min(1).max(255).optional(),
  biography: Joi.string().trim().min(1).optional(),
  profile_image_url: Joi.string().uri().allow(null, '').optional(),
})
  .min(1)
  .message('At least one field must be provided to update');

/**
 * Validation schema for route parameters that carry a Leader UUID.
 */
export const leaderIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});
