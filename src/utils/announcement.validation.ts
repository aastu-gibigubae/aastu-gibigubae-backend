import Joi from 'joi';

export const createAnnouncementSchema = Joi.object({
  title: Joi.string().trim().min(1).max(255).required(),
  content: Joi.string().trim().min(1).required(),
  expires_at: Joi.date().iso().required(),
  is_active: Joi.boolean().optional(),
  userId: Joi.string().uuid().required(),
});

export const updateAnnouncementSchema = Joi.object({
  title: Joi.string().trim().min(1).max(255).optional(),
  content: Joi.string().trim().min(1).optional(),
  expires_at: Joi.date().iso().optional(),
  is_active: Joi.boolean().optional(),
  userId: Joi.string().uuid().optional(),
}).min(1);

export const announcementIdParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});
