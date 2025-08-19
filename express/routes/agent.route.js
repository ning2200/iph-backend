import express from 'express';
import * as agentController from '../controllers/agent.controller.js';

const agentRouter = express.Router();

// agentRouter.post('/agentMessage/:userID', saveAgentMessage);
agentRouter.get('/data/userID/:ticket/:msgID', agentController.retrieveUserIDFromTicket);
agentRouter.post('/query/restricted/:ticket', agentController.updateRestrictedQuery);

export default agentRouter;