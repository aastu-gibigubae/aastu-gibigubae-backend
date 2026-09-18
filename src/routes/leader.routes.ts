import { Router } from 'express';
import { createAuthMiddleware } from "../middlewares/auth.middleware.js";
import { requireScopeAccess } from "../middlewares/scopeAccess.middleware.js";
import { ScopeArea } from "../generated/prisma/enums.js";
import { strictLimiter } from '../middlewares/rateLimit.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { sanitizeRichText } from '../middlewares/sanitize.middleware.js';
import {
  createLeaderSchema,
  updateLeaderSchema,
  leaderIdParamSchema,
} from '../utils/leader.validation.js';
import * as leaderController from '../controllers/leader.controller.js';
import { config } from '../../config/config.js';

const leaderRouter = Router();

const authenticate = createAuthMiddleware(config.JWT_PUBLIC_KEY);

//A route to access all leaders
leaderRouter.get('/', leaderController.getLeaders);

//A route to access a specifc leader
leaderRouter.get(
  '/:id',
  validate(leaderIdParamSchema, 'params'),
  leaderController.getLeaderById
);

//A route to add a leader
leaderRouter.post(
  '/',
  authenticate,
  requireScopeAccess(ScopeArea.LEADERSHIP),
  strictLimiter,
  sanitizeRichText,
  validate(createLeaderSchema),
  leaderController.createLeader
);

//A route to update leader informations
leaderRouter.put(
  '/:id',
  authenticate,
  requireScopeAccess(ScopeArea.LEADERSHIP),
  strictLimiter,
  sanitizeRichText,
  validate(leaderIdParamSchema, 'params'),
  validate(updateLeaderSchema),
  leaderController.updateLeader
);

//A route to delete a leader
leaderRouter.delete(
  '/:id',
  authenticate,
  requireScopeAccess(ScopeArea.LEADERSHIP),
  strictLimiter,
  validate(leaderIdParamSchema, 'params'),
  leaderController.deleteLeader
);

export default leaderRouter;
