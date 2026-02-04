export type MatchType = 'EXACT' | 'PHRASE' | 'BROAD';
export type KeywordStatus = 'ENABLED' | 'PAUSED' | 'REMOVED';

export interface Keyword {
  id: string;
  adGroupId: string;
  text: string;
  matchType: MatchType;
  status: KeywordStatus;
}
