import express from 'express';
import eventRoutes from './event.routes.js';
import userRoutes from './user.routes.js';
import ticketRoutes from './ticket.routes.js'

const router = express.Router();

router.use('/event', eventRoutes);
router.use('/users', userRoutes);
router.use('/ticket', ticketRoutes);

router.get('*', (req, res)=>{`<div style="text-align:center"><h1>404 NOT FOUND</h1><p>The requested URL endpoint doesn't exist</p></div>`})

export default router;
