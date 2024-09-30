import express from 'express';
import eventController from '../Controller/event.controller.js';
import verifyAuth from '../MiddleWare/verifyAuth.js';
import ticketController from '../Controller/ticket.controller.js';

const router = express.Router();

router.post('/purchaseTicket', ticketController.purchaseTicket);
router.post('/payment', ticketController.payment);
router.get('/findEmail', ticketController.findEmail);

export default router;