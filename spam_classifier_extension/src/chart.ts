import { WordFrequencyAnalysisResult } from './types';

export class ChartManager {
  private chart: any = null;

  createWordFrequencyChart(canvasId: string, data: WordFrequencyAnalysisResult): void {
    const container = document.getElementById('chartContainer');
    if (!container) {
      throw new Error(`Chart container not found`);
    }

    // Create text-based chart since Chart.js has CSP issues
    container.innerHTML = this.createTextChart(data);
    container.classList.remove('hidden');
  }

  private createTextChart(data: WordFrequencyAnalysisResult): string {
    let html = `
      <div style="padding: 10px;">
        <h4>Kết quả phân tích: "${data.target_word}"</h4>
        <div style="font-family: monospace; font-size: 12px;">
    `;

    // Find max confidence for scaling
    const maxConf = Math.max(...data.results.map(r => r.confidence));
    
    data.results.forEach(point => {
      const barWidth = (point.confidence / maxConf) * 100;
      html += `
        <div style="margin: 5px 0; display: flex; align-items: center;">
          <span style="width: 30px; text-align: right; margin-right: 10px;">n=${point.n}:</span>
          <div style="width: 200px; height: 20px; background: #f0f0f0; margin-right: 10px; position: relative;">
            <div style="width: ${barWidth}%; height: 100%; background: linear-gradient(90deg, #4285f4, #ff6b9d);"></div>
          </div>
          <span>${point.confidence.toFixed(1)}%</span>
        </div>
      `;
    });

    html += `
        </div>
        <div style="margin-top: 15px; font-size: 11px; color: #666;">
          <strong>Giải thích:</strong> n = số lần từ "${data.target_word}" xuất hiện, 
          thanh màu = % confidence spam
        </div>
      </div>
    `;

    return html;
  }

  destroy(): void {
    // No cleanup needed for text chart
  }
} 