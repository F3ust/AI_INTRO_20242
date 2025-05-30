import { ApiService } from './api';
import { ChartManager } from './chart';

class PopupManager {
  private chartManager: ChartManager;

  constructor() {
    this.chartManager = new ChartManager();
    this.initEventListeners();
  }

  private initEventListeners(): void {
    // Spam classify tab
    const checkBtn = document.getElementById('checkBtn') as HTMLButtonElement;
    if (checkBtn) {
      checkBtn.addEventListener('click', () => this.handleSpamCheck());
    }

    // Word freq analysis tab
    const analyzeBtn = document.getElementById('analyzeBtn') as HTMLButtonElement;
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => this.handleWordFrequencyAnalysis());
    }

    // Tab switch
    const spamTab = document.getElementById('spamTab') as HTMLButtonElement;
    const analysisTab = document.getElementById('analysisTab') as HTMLButtonElement;

    if (spamTab) {
      spamTab.addEventListener('click', () => this.switchTab('spam'));
    }

    if (analysisTab) {
      analysisTab.addEventListener('click', () => this.switchTab('analysis'));
    }
  }

  private switchTab(tab: 'spam' | 'analysis'): void {
    const spamContent = document.getElementById('spamContent');
    const analysisContent = document.getElementById('analysisContent');
    const spamTab = document.getElementById('spamTab');
    const analysisTab = document.getElementById('analysisTab');

    if (tab === 'spam') {
      spamContent?.classList.remove('hidden');
      analysisContent?.classList.add('hidden');
      spamTab?.classList.add('active');
      analysisTab?.classList.remove('active');
    } else {
      spamContent?.classList.add('hidden');
      analysisContent?.classList.remove('hidden');
      spamTab?.classList.remove('active');
      analysisTab?.classList.add('active');
    }
  }

  private async handleSpamCheck(): Promise<void> {
    const emailContent = (document.getElementById('emailContent') as HTMLTextAreaElement)?.value;
    const resultDiv = document.getElementById('result') as HTMLDivElement;
    const checkBtn = document.getElementById('checkBtn') as HTMLButtonElement;

    if (!emailContent?.trim()) {
      this.showError(resultDiv, 'Vui lòng nhập nội dung email');
      return;
    }

    try {
      checkBtn.disabled = true;
      checkBtn.textContent = 'Đang phân tích...';

      const result = await ApiService.predictSpam(emailContent);

      resultDiv.className = result.is_spam ? 'result spam' : 'result ham';
      resultDiv.innerHTML = `
        <div>Kết quả: <strong>${result.label.toUpperCase()}</strong></div>
        <div>Độ tin cậy: <strong>${(result.confidence * 100).toFixed(1)}%</strong></div>
      `;
      resultDiv.classList.remove('hidden');

    } catch (error) {
      this.showError(resultDiv, 'Lỗi khi phân tích email. Vui lòng thử lại.');
      console.error('Err:', error);
    } finally {
      checkBtn.disabled = false;
      checkBtn.textContent = 'Kiểm tra';
    }
  }

  private async handleWordFrequencyAnalysis(): Promise<void> {
    const wordCount = parseInt((document.getElementById('wordCount') as HTMLInputElement)?.value);
    const targetWord = (document.getElementById('targetWord') as HTMLInputElement)?.value;
    const baseText = (document.getElementById('baseText') as HTMLTextAreaElement)?.value;
    const analyzeBtn = document.getElementById('analyzeBtn') as HTMLButtonElement;
    const chartContainer = document.getElementById('chartContainer') as HTMLDivElement;

    if (!wordCount || wordCount <= 0) {
      this.showAnalysisError('Vui lòng nhập số từ hợp lệ (> 0)');
      return;
    }

    if (!targetWord?.trim()) {
      this.showAnalysisError('Vui lòng nhập từ cần phân tích');
      return;
    }

    try {
      analyzeBtn.disabled = true;
      analyzeBtn.textContent = 'Đang phân tích...';

      const result = await ApiService.analyzeWordFrequency({
        word_count: wordCount,
        target_word: targetWord.trim(),
        base_text: baseText?.trim() || undefined
      });

      // Show chart
      chartContainer.classList.remove('hidden');
      this.chartManager.createWordFrequencyChart('frequencyChart', result);

      // Hide err if any
      const errorDiv = document.getElementById('analysisError');
      if (errorDiv) {
        errorDiv.classList.add('hidden');
      }

    } catch (error) {
      this.showAnalysisError('Lỗi khi phân tích. Vui lòng thử lại.');
      console.error('Err:', error);
    } finally {
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = 'Phân tích';
    }
  }

  private showError(resultDiv: HTMLDivElement, message: string): void {
    resultDiv.className = 'result error';
    resultDiv.textContent = message;
    resultDiv.classList.remove('hidden');
  }

  private showAnalysisError(message: string): void {
    const errorDiv = document.getElementById('analysisError') as HTMLDivElement;
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.classList.remove('hidden');
    }
  }
}

// Init popup when DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
}); 