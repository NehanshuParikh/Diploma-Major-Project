// routes/jibbleRoutes.js
import express from 'express';
import { testJibbleConnection } from '../controllers/jibbleController.js';
import {getJibbleAccessToken} from '../middleware/jibbleAuth.js';

const router = express.Router();

router.get('/jibble-connection/test', getJibbleAccessToken, testJibbleConnection);

export default router;
