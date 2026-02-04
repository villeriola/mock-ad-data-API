export type AdGroupStatus = 'ENABLED' | 'PAUSED' | 'REMOVED';

export interface AdGroup {
  id: string;
  campaignId: string;
  name: string;
  status: AdGroupStatus;
  cpcBid: number;
}
