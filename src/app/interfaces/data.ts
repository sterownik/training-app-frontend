export interface Me {
  id: Number;
  stravaAthleteId: Number;
  firstname: string;
  lastname: string;
  stravaAccessToken: string;
  stravaRefreshToken: string;
  avatarUrl: string;
}

export interface ActivityDto {
  id: number;
  type: string;
  distance: string;
  averageSpeed: number;
  startDateLocal: string;
  averageWatts: number | null;
  description: string;
  descriptionTyped: string | null;
  photoUrl: string | null;
  moving_time: string;
  averageHeartRate: number;
  normalizedPower: number | null;
  pace: string | null;
  laps: string;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  sort: Sort;
  unpaged: boolean;
}

export interface PageActivityDto {
  content: ActivityDto[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number; // bieżący numer strony
  numberOfElements: number; // liczba elementów na stronie
  pageable: Pageable;
  size: number; // rozmiar strony
  sort: Sort;
  totalElements: number;
  totalPages: number;
}

export interface FilterActivityType {
  filterType: string; // np. "date"
  startDateLocalStart: string; // data w formacie ISO
  startDateLocalEnd: string; // data w formacie ISO
}

export interface StravaAnalysisRequest {
  prompt: string;
  filterActivityType: FilterActivityType;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number; // unix timestamp
  model: string;
  choices: Choice[];
  usage: Usage;
  service_tier: string;
  system_fingerprint: string;
}

export interface Choice {
  index: number;
  message: Message;
  logprobs: any | null;
  finish_reason: string;
}

export interface Message {
  role: 'assistant' | 'user' | 'system';
  content: string;
  refusal: any | null;
  annotations: any[];
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  prompt_tokens_details: TokenDetails;
  completion_tokens_details: TokenDetails;
}

export interface TokenDetails {
  cached_tokens: number;
  audio_tokens: number;
  accepted_prediction_tokens?: number;
  rejected_prediction_tokens?: number;
}

export interface ActivityExtendedFromInterface {
  id: number;
  descriptionTyped: string | null;
  npPower: number | string;
  isBike: boolean | null;
}
