import { Router } from 'express';
import * as announcementController from '../controllers/announcement.controller.js';

const router = Router();

// No auth/role checks yet — per current task instructions, this is
// logic-only. Scoped (announcements) access control per Technical
// Reference §4.5 gets layered on once Sub-Admin scope middleware exists.

router.get('/', announcementController.listAnnouncements);
router.get('/:id', announcementController.getAnnouncement);
router.post('/', announcementController.createAnnouncement);
router.put('/:id', announcementController.updateAnnouncement);
router.delete('/:id', announcementController.deleteAnnouncement);

export default router;