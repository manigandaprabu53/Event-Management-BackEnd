import express from 'express';
import eventController from '../Controller/event.controller.js';
import verifyAuth from '../MiddleWare/verifyAuth.js';
import verifyOrganizer from '../MiddleWare/verifyOrganizer.js';
import verifyAdmin from '../MiddleWare/verifyAdmin.js';
const router = express.Router();

router.post('/createEvent',verifyAuth, verifyOrganizer, eventController.createEvent);
router.get('/getAllEvents/:id', verifyAuth, verifyOrganizer, eventController.getAllEvents);
router.get('/search', verifyAuth, eventController.searchEvents)
router.get('/pendingEvents', verifyAuth, verifyAdmin, eventController.pendingEvents);
router.put('/approveEvent', verifyAuth, verifyAdmin, eventController.approveEvent);
router.put('/rejectEvent', verifyAuth, verifyAdmin, eventController.rejectEvent);
router.put('/cancelEvent/:id', eventController.cancelEvent);
router.get('/getApprovedEvents', verifyAuth, eventController.getApprovedEvents);
router.get('/getEventById/:id', verifyAuth, eventController.getEventById);

export default router;