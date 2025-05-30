import { WordFrequencyAnalysisResult } from './types';

export class ChartManager {
  private chart: any = null;

  createWordFrequencyChart(canvasId: string, data: WordFrequencyAnalysisResult): void {
    const container = document.getElementById('chartContainer');
    if (!container) {
      throw new Error(`Chart container not found`);
    }

    container.innerHTML = this.createTextChart(data);
    container.classList.remove('hidden');
  }

  private createTextChart(data: WordFrequencyAnalysisResult): string {
    let html = `
      <div style="padding: 10px;">
        <h4>Analysis Result: "${data.target_word}"</h4>
        <div style="font-family: monospace; font-size: 12px;">
    `;

    const maxConf = Math.max(...data.results.map(r => r.confidence));
    const minConf = Math.min(...data.results.map(r => r.confidence));
    
    console.log('Chart data:', data.results);
    console.log('Max confidence:', maxConf, 'Min confidence:', minConf);
    
    data.results.forEach(point => {
      const barWidth = maxConf > 0 ? (point.confidence / maxConf) * 100 : 0;
      html += `
        <div style="margin: 5px 0; display: flex; align-items: center;">
          <span style="width: 30px; text-align: right; margin-right: 10px;">n=${point.n}:</span>
          <div style="width: 200px; height: 20px; background: #f0f0f0; margin-right: 10px; position: relative;">
            <div style="width: ${barWidth}%; height: 100%; background: linear-gradient(90deg, #4285f4, #ff6b9d);"></div>
          </div>
          <span>${point.confidence.toFixed(2)}%</span>
        </div>
      `;
    });

    html += `
        </div>
        <div style="margin-top: 15px; font-size: 11px; color: #666;">
          <strong>Explanation:</strong> n = number of times "${data.target_word}" appears, 
          colored bar = spam confidence %
        </div>
      </div>
    `;

    return html;
  }
}