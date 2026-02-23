
export enum BinColor {
  BROWN = 'BROWN',
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  BLUE = 'BLUE',
  UNKNOWN = 'UNKNOWN'
}

export interface WasteAnalysis {
  itemName: string;
  binColor: BinColor;
  reason: string;
  confidence: number;
  disposalTips: string[];
}

export interface BinRule {
  color: BinColor;
  label: string;
  description: string;
  prohibited: string[];
  examples: string[];
  bgColor: string;
  textColor: string;
  borderColor: string;
  accentColor: string;
}
