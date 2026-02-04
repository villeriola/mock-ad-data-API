import type { Account } from '../models/index.js';

export type Industry = 'ecommerce' | 'saas' | 'local_services' | 'travel' | 'finance';

export interface AccountSeed extends Account {
  industry: Industry;
}

// Pre-defined mock accounts with different industries
export const MOCK_ACCOUNTS: AccountSeed[] = [
  {
    id: '123-456-7890',
    name: 'Acme E-Commerce Store',
    currencyCode: 'USD',
    timezone: 'America/New_York',
    industry: 'ecommerce',
  },
  {
    id: '234-567-8901',
    name: 'CloudFlow SaaS Platform',
    currencyCode: 'USD',
    timezone: 'America/Los_Angeles',
    industry: 'saas',
  },
  {
    id: '345-678-9012',
    name: 'Metro Plumbing Services',
    currencyCode: 'USD',
    timezone: 'America/Chicago',
    industry: 'local_services',
  },
  {
    id: '456-789-0123',
    name: 'Wanderlust Travel Agency',
    currencyCode: 'USD',
    timezone: 'America/Denver',
    industry: 'travel',
  },
  {
    id: '567-890-1234',
    name: 'Apex Financial Advisors',
    currencyCode: 'USD',
    timezone: 'America/New_York',
    industry: 'finance',
  },
];

export function getAccountById(id: string): AccountSeed | undefined {
  return MOCK_ACCOUNTS.find((a) => a.id === id);
}

export function getAllAccounts(): AccountSeed[] {
  return MOCK_ACCOUNTS;
}
