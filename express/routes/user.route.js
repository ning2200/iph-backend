import express from 'express';
import * as userController from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.post('/auth/:userID', userController.authenticateUser);
userRouter.post('/auth/approve/:userID', userController.approveUser);
userRouter.post('/auth/reject/:userID', userController.rejectUser);
userRouter.get('/data/exists/:userID', userController.userExists);
userRouter.get('/data/:userID', userController.retrieveUserData);
userRouter.post('/query/:ticket', userController.saveUserQuery);
userRouter.get('/query/history/:ticket', userController.retrieveQueryHistory);

export default userRouter;