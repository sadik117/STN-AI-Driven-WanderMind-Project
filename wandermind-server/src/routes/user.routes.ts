import { Router } from 'express';
import { getProfile, updateProfile, getNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification, getMyJournals, createJournal, getMyPackingLists } from '../controllers/user.controller';
import { upload } from '../middleware/upload.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', upload.single('image'), updateProfile);
router.get('/notifications', getNotifications);
router.post('/notifications/mark-all-read', markAllNotificationsRead);
router.patch('/notifications/:id/read', markNotificationRead);
router.delete('/notifications/:id', deleteNotification);
router.get('/journals', getMyJournals);
router.post('/journals', createJournal);
router.get('/packing-lists', getMyPackingLists);

export default router;