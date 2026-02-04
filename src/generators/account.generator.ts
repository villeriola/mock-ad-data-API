import type { Campaign, AdGroup, Keyword, CampaignStatus, AdGroupStatus } from '../models/index.js';
import { SeededRandom, createSeed } from '../utils/seeded-random.js';
import { type AccountSeed, getAccountById } from '../data/accounts.js';
import { CAMPAIGN_TEMPLATES } from '../data/campaign-templates.js';
import { generateKeywordsForAdGroup } from '../data/keyword-templates.js';

export interface AccountStructure {
  account: AccountSeed;
  campaigns: Campaign[];
  adGroups: AdGroup[];
  keywords: Keyword[];
}

// Cache for generated account structures
const structureCache = new Map<string, AccountStructure>();

export function getAccountStructure(accountId: string): AccountStructure | null {
  // Check cache first
  if (structureCache.has(accountId)) {
    return structureCache.get(accountId)!;
  }

  const account = getAccountById(accountId);
  if (!account) {
    return null;
  }

  const structure = generateAccountStructure(account);
  structureCache.set(accountId, structure);
  return structure;
}

function generateAccountStructure(account: AccountSeed): AccountStructure {
  const rng = new SeededRandom(createSeed('structure', account.id));
  const templates = CAMPAIGN_TEMPLATES[account.industry];

  const campaigns: Campaign[] = [];
  const adGroups: AdGroup[] = [];
  const keywords: Keyword[] = [];

  // Generate campaigns from templates
  templates.forEach((template, campaignIndex) => {
    const campaignId = `camp_${String(campaignIndex + 1).padStart(3, '0')}`;
    const status = pickStatus(rng, 0.8); // 80% enabled

    campaigns.push({
      id: campaignId,
      accountId: account.id,
      name: template.namePattern,
      status,
      type: template.type,
      dailyBudget: rng.int(50, 500) * 10, // $500-$5000
    });

    // Generate ad groups for this campaign
    template.adGroupPatterns.forEach((adGroupPattern, adGroupIndex) => {
      const adGroupId = `${campaignId}_ag_${String(adGroupIndex + 1).padStart(2, '0')}`;
      const adGroupStatus = status === 'REMOVED' ? 'REMOVED' : pickStatus(rng, 0.85);

      adGroups.push({
        id: adGroupId,
        campaignId,
        name: adGroupPattern,
        status: adGroupStatus,
        cpcBid: Math.round(rng.float(0.5, 5) * 100) / 100,
      });

      // Generate keywords for this ad group
      const keywordCount = rng.int(5, 12);
      const keywordTexts = generateKeywordsForAdGroup(
        account.industry,
        adGroupPattern,
        keywordCount,
        (arr) => rng.pick(arr)
      );

      keywordTexts.forEach((text, keywordIndex) => {
        const keywordId = `${adGroupId}_kw_${String(keywordIndex + 1).padStart(2, '0')}`;
        const keywordStatus = adGroupStatus === 'REMOVED' ? 'REMOVED' : pickStatus(rng, 0.9);

        keywords.push({
          id: keywordId,
          adGroupId,
          text,
          matchType: rng.pick(['EXACT', 'PHRASE', 'BROAD'] as const),
          status: keywordStatus,
        });
      });
    });
  });

  return { account, campaigns, adGroups, keywords };
}

function pickStatus(rng: SeededRandom, enabledProbability: number): CampaignStatus | AdGroupStatus {
  const roll = rng.random();
  if (roll < enabledProbability) return 'ENABLED';
  if (roll < enabledProbability + (1 - enabledProbability) * 0.7) return 'PAUSED';
  return 'REMOVED';
}

// Helper functions to get entities
export function getCampaignsForAccount(accountId: string): Campaign[] {
  const structure = getAccountStructure(accountId);
  return structure?.campaigns || [];
}

export function getAdGroupsForCampaign(accountId: string, campaignId: string): AdGroup[] {
  const structure = getAccountStructure(accountId);
  return structure?.adGroups.filter((ag) => ag.campaignId === campaignId) || [];
}

export function getKeywordsForAdGroup(accountId: string, adGroupId: string): Keyword[] {
  const structure = getAccountStructure(accountId);
  return structure?.keywords.filter((kw) => kw.adGroupId === adGroupId) || [];
}
