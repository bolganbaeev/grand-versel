export type Language = 'kz' | 'ru';
export type Year = '2024' | '2026';

export type GopTuple = [code: string, nameKz: string, nameRu: string, areaCode: string];
export type UniTuple = [code: string, nameKz: string, nameRu: string, regCode: number];
export type AreaTuple = [code: string, nameKz: string, nameRu: string];
export type RegTuple = [code: number, nameKz: string, nameRu: string];
export type FormTuple = [nameKzFull: string, nameKzShort: string, nameRuShort: string];
export type QuotaTuple = [code: string, nameKz: string, nameRu: string];
export type SecTuple = [nameKz: string, nameRu: string];

export interface MetaData {
  year: string;
  total: number;
  gops: GopTuple[];
  unis: UniTuple[];
  areas: AreaTuple[];
  regs: RegTuple[];
  forms: FormTuple[];
  quotas: QuotaTuple[];
  secs: SecTuple[];
  cgop: number[];
  cuni: number[];
  nletters: string[];
}

export type RawRecipient = [
  untId: string,
  fullName: string,
  score: number,
  uniIndex: number,
  gopCodeOrIndex: number,
  quotaFlag1: number,
  quotaFlag2: number,
  specialQuota: number
];

export interface Recipient {
  untId: string;
  fullName: string;
  score: number;
  uniCode: string;
  uniNameKz: string;
  uniNameRu: string;
  quotaFlag1: number;
  quotaFlag2: number;
  specialQuota: number;
}

export interface UniStat {
  uniCode: string;
  uniNameKz: string;
  uniNameRu: string;
  regCode: number;
  count: number;
  minScore: number;
  maxScore: number;
  avgScore: number;
}

export interface GopDetail {
  code: string;
  nameKz: string;
  nameRu: string;
  areaCode: string;
  totalRecipients: number;
  minScore: number;
  maxScore: number;
  avgScore: number;
  recipients: Recipient[];
  uniBreakdown: UniStat[];
}

export interface UniDetail {
  code: string;
  nameKz: string;
  nameRu: string;
  regCode: number;
  regNameKz: string;
  regNameRu: string;
  totalGrants: number;
  minScore: number;
  maxScore: number;
  avgScore: number;
  gopBreakdown: {
    gopCode: string;
    gopNameKz: string;
    gopNameRu: string;
    count: number;
    minScore: number;
    maxScore: number;
    avgScore: number;
  }[];
}

export interface CalculatorInput {
  score: number;
  gopCode: string;
  uniCode?: string;
  quotaType?: string;
  year: Year;
}

export interface Recommendation {
  gopCode: string;
  gopNameKz: string;
  gopNameRu: string;
  minScore: number;
  avgScore: number;
  totalGrants: number;
  chancePercent: number;
}

export interface CalculatorOutput {
  score: number;
  gopCode: string;
  gopNameKz: string;
  gopNameRu: string;
  minPassingScore: number;
  maxScore: number;
  avgScore: number;
  totalGrants: number;
  chancePercent: number;
  chanceLabel: 'high' | 'medium' | 'low' | 'unlikely';
  percentile: number;
  recommendations: Recommendation[];
}

export interface ApplicantSearchResult {
  untId: string;
  fullName: string;
  score: number;
  gopCode: string;
  gopNameKz: string;
  gopNameRu: string;
  uniCode: string;
  uniNameKz: string;
  uniNameRu: string;
  quotaFlag1: number;
  quotaFlag2: number;
  specialQuota: number;
  year: Year;
}
