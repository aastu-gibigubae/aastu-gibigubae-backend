import { Router } from 'express';
import * as announcementController from '../controllers/announcement.controller.js';

import { createAuthMiddleware, requireRole } from "../middlewares/auth.middleware.js";
import { strictLimiter } from "../middlewares/rateLimit.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { sanitizeRichText } from "../middlewares/sanitize.middleware.js";
import { createAnnouncementSchema, updateAnnouncementSchema, announcementIdParamSchema } from "../utils/announcement.validation.js";
import { config } from "../../config/config.js";

const router = Router();
const authenticate = createAuthMiddleware(config.JWT_PUBLIC_KEY);

router.get('/', announcementController.listAnnouncements);

router.get(
  '/:id',
  validate(announcementIdParamSchema, 'params'),
  announcementController.getAnnouncement
);

router.post(
  '/',
  authenticate,
  requireRole('ADMIN', 'SUB_ADMIN'),
  strictLimiter,
  sanitizeRichText,
  validate(createAnnouncementSchema),
  announcementController.createAnnouncement
);

router.put(
  '/:id',
  authenticate,
  requireRole('ADMIN', 'SUB_ADMIN'),
  strictLimiter,
  sanitizeRichText,
  validate(announcementIdParamSchema, 'params'),
  validate(updateAnnouncementSchema),
  announcementController.updateAnnouncement
);

router.delete(
  '/:id',
  authenticate,
  requireRole('ADMIN', 'SUB_ADMIN'),
  strictLimiter,
  validate(announcementIdParamSchema, 'params'),
  announcementController.deleteAnnouncement
);

export default router;