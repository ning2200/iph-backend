import express from 'express';
import { queryDB } from '../controllers/dashboard.controller.js';

const dashboardRouter = express.Router();

dashboardRouter.get('/user/data/temp', queryDB);

export default dashboardRouter;