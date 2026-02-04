export type CampaignStatus = 'ENABLED' | 'PAUSED' | 'REMOVED';
export type CampaignType = 'SEARCH' | 'DISPLAY' | 'VIDEO' | 'SHOPPING';

export interface Campaign {
  id: string;
  accountId: string;
  name: string;
  status: CampaignStatus;
  type: CampaignType;
  dailyBudget: number;
}
