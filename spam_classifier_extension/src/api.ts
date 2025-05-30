import { SpamPredictionResult, WordFrequencyAnalysisRequest, WordFrequencyAnalysisResult } from './types';

const API_BASE_URL = 'http://localhost:42069';

export class ApiService {
  static async predictSpam(text: string): Promise<SpamPredictionResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Err predict spam:', error);
      throw error;
    }
  }

  static async analyzeWordFrequency(request: WordFrequencyAnalysisRequest): Promise<WordFrequencyAnalysisResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/analyze_word_frequency`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Err analyze freq:', error);
      throw error;
    }
  }
} 