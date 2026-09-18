import { Router } from "express";
import * as adminScopeController from "../controllers/adminScope.controller.js";
import { createAuthMiddleware, requireRole } from "../middlewares/auth.middleware.js";
import { config } from "../../config/config.js";
import { validate } from "../middlewares/validate.middleware.js";
import { grantScopeSchema } from "../utils/adminScope.validation.js";

const router = Router();
const authenticate = createAuthMiddleware(config.JWT_PUBLIC_KEY);

// All scope management endpoints require main ADMIN role
router.use(authenticate, requireRole('ADMIN'));

router.get("/:userId/scopes", adminScopeController.getScopes);

router.post(
  "/:userId/scopes",
  validate(grantScopeSchema),
  adminScopeController.grantScope
);

router.delete("/:userId/scopes/:scope_area", adminScopeController.revokeScope);

export default router;
