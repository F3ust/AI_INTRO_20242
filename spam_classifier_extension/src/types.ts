export interface SpamPredictionResult {
  is_spam: boolean;
  confidence: number;
  label: string;
}

export interface WordFrequencyAnalysisRequest {
  word_count: number;
  target_word: string;
  base_text?: string;
}

export interface WordFrequencyPoint {
  n: number;
  confidence: number;
  text_preview: string;
}

export interface WordFrequencyAnalysisResult {
  results: WordFrequencyPoint[];
  target_word: string;
  word_count: number;
}

export interface ApiResponse<T> {
  error?: string;
  data?: T;
} 