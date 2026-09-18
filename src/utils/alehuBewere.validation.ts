import Joi from "joi";
import { SubscriptionStatus } from "../generated/prisma/enums.js";

export const createSubscriptionSchema = Joi.object({
  package_name: Joi.string().required().messages({
    "string.empty": "package_name cannot be empty",
    "any.required": "package_name is required",
  }),
  amount: Joi.number().positive().optional().messages({
    "number.positive": "amount must be a positive number",
  }),
  full_name: Joi.string().max(100).required().messages({
    "string.empty": "full_name cannot be empty",
    "any.required": "full_name is required",
    "string.max": "full_name cannot exceed 100 characters",
  }),
  phone_number: Joi.string()
    .pattern(/^\+?[0-9\s\-\(\)]{7,20}$/)
    .required()
    .messages({
      "string.pattern.base": "phone_number format is invalid",
      "string.empty": "phone_number cannot be empty",
      "any.required": "phone_number is required",
    }),
  email: Joi.string().email().optional().messages({
    "string.email": "email must be a valid email address",
  }),
});

export const updateSubscriptionSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(SubscriptionStatus))
    .required()
    .messages({
      "any.required": "status is required",
      "any.only": "invalid subscription status",
    }),
  admin_note: Joi.string().allow(null, "").optional(),
});

export const subscriptionIdParamSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    "string.guid": "Invalid subscription ID format",
    "any.required": "Subscription ID is required",
  }),
});
