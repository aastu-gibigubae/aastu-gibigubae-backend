import { Router } from 'express';
import * as announcementController from '../controllers/announcement.controller.js';

import { createAuthMiddleware} from "../middlewares/auth.middleware.js";
import { requireScopeAccess } from "../middlewares/scopeAccess.middleware.js";
import { ScopeArea } from "../generated/prisma/enums.js";
import { strictLimiter } from "../middlewares/rateLimit.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { sanitizeRichText } from "../middlewares/sanitize.middleware.js";
import { createAnnouncementSchema, updateAnnouncementSchema, announcementIdParamSchema } from "../utils/announcement.validation.js";
import { config } from "../../config/config.js";

const router = Router();
const authenticate = createAuthMiddleware(config.JWT_PUBLIC_KEY);

router.get('/', announcementController.listAnnouncements);

router.get(
  '/admin/:id',
  authenticate,
  requireScopeAccess(ScopeArea.ANNOUNCEMENTS),
  validate(announcementIdParamSchema, 'params'),
  announcementController.getAnnouncementAdmin
);

router.get(
  '/:id',
  validate(announcementIdParamSchema, 'params'),
  announcementController.getAnnouncement
);

router.post(
  '/',
  authenticate,
  requireScopeAccess(ScopeArea.ANNOUNCEMENTS),
  strictLimiter,
  sanitizeRichText,
  validate(createAnnouncementSchema),
  announcementController.createAnnouncement
);

router.put(
  '/:id',
  authenticate,
  requireScopeAccess(ScopeArea.ANNOUNCEMENTS),
  strictLimiter,
  sanitizeRichText,
  validate(announcementIdParamSchema, 'params'),
  validate(updateAnnouncementSchema),
  announcementController.updateAnnouncement
);

router.delete(
  '/:id',
  authenticate,
  requireScopeAccess(ScopeArea.ANNOUNCEMENTS),
  strictLimiter,
  validate(announcementIdParamSchema, 'params'),
  announcementController.deleteAnnouncement
);

export default router;