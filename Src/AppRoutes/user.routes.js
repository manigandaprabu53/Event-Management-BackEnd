import express from 'express';
import userController from '../Controller/user.controller.js';
import verifyAuth from '../MiddleWare/verifyAuth.js';
import verifyAdmin from '../MiddleWare/verifyAdmin.js';
import verifyOrganizer from '../MiddleWare/verifyOrganizer.js';

const router = express.Router();

router.post('/createUser', userController.createUser);
router.post('/loginUser', userController.loginUser);
router.put('/forgotPassword', userController.forgotPassword);
router.put('/resetPassword/:token', userController.resetPassword);
router.get('/getAllUsers', verifyAuth, verifyAdmin, userController.getAllUsers);
router.put('/editUserById/:id', verifyAuth, verifyAdmin, userController.editUserById);
router.delete('/deleteUserById/:id', verifyAuth, verifyAdmin, userController.deleteUserById);
router.put('/memberForm', verifyAuth, userController.memberForm);
router.get('/pendingOrganizers', verifyAuth, verifyAdmin, userController.pendingOrganizers);
router.put('/approveOrganizer', verifyAuth, verifyAdmin, userController.approveOrganizer);
router.put('/rejectOrganizer', userController.rejectOrganizer);

export default router;