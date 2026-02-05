import type { RequestHandler } from 'express';
import { getAllAccounts, getAccountById } from '../data/accounts.js';
import { getCampaignsForAccount } from '../generators/account.generator.js';
import { createError } from '../middleware/error-handler.js';

interface AccountParams {
  id: string;
}

export const listAccounts: RequestHandler = (_req, res) => {
  const accounts = getAllAccounts().map(({ industry, ...account }) => account);
  res.json({ authentication: res.locals.authStatus, accounts });
};

export const getAccount: RequestHandler<AccountParams> = (req, res, next) => {
  const { id } = req.params;
  const account = getAccountById(id);

  if (!account) {
    return next(createError(`Account not found: ${id}`, 'ACCOUNT_NOT_FOUND', 404));
  }

  const { industry, ...accountData } = account;
  res.json({ authentication: res.locals.authStatus, ...accountData });
};

export const listCampaigns: RequestHandler<AccountParams> = (req, res, next) => {
  const { id } = req.params;
  const account = getAccountById(id);

  if (!account) {
    return next(createError(`Account not found: ${id}`, 'ACCOUNT_NOT_FOUND', 404));
  }

  const campaigns = getCampaignsForAccount(id);
  res.json({ authentication: res.locals.authStatus, campaigns });
};
