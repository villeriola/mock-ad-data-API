import { Router } from 'express';
import { listAccounts, getAccount, listCampaigns } from '../controllers/accounts.controller.js';

const router = Router();

router.get('/accounts', listAccounts);
router.get('/accounts/:id', getAccount);
router.get('/accounts/:id/campaigns', listCampaigns);

export default router;
