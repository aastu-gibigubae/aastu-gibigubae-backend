import Joi from "joi";
import { ScopeArea } from "../generated/prisma/enums.js";

export const grantScopeSchema = Joi.object({
  scope_area: Joi.string()
    .valid(...Object.values(ScopeArea))
    .required()
    .messages({
      "any.required": "scope_area is required",
      "any.only": "Invalid scope_area",
    }),
});
