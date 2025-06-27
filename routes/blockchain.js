import express from 'express';
import { writeTweetToBlockchain } from '../controllers/blockchainController.js';

const router = express.Router();

router.post('/write', writeTweetToBlockchain);

export default router;
