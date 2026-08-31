import fs from 'fs';
import path from 'path';

function generateMarketSeries() {
  const fixturesDir = path.join(__dirname, '../core/fixtures');
  const targetFile = path.join(fixturesDir, 'syntheticMarketSeriesDataset.ts');
  console.log('Generating Synthetic Market Series Dataset at:', targetFile);

  const lines: string[] = [];
  lines.push('/**');
  lines.push(' * VaultFlow High-Frequency Synthetic Market Price Time-Series Dataset');
  lines.push(' */');
  lines.push('');
  lines.push('export interface StockPricePoint {');
  lines.push('  symbol: string;');
  lines.push('  timestamp: string;');
  lines.push('  open: number;');
  lines.push('  high: number;');
  lines.push('  low: number;');
  lines.push('  close: number;');
  lines.push('  volume: number;');
  lines.push('}');
  lines.push('');
  lines.push('export const SYNTHETIC_STOCK_PRICE_SERIES: StockPricePoint[] = [');

  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'BRK.B', 'JPM', 'V', 'MA', 'UNH', 'HD', 'PG', 'BAC'];

  let basePrices: Record<string, number> = {
    AAPL: 180.00, MSFT: 420.00, GOOGL: 175.00, AMZN: 185.00, NVDA: 120.00,
    TSLA: 210.00, META: 480.00, 'BRK.B': 410.00, JPM: 200.00, V: 270.00,
    MA: 450.00, UNH: 520.00, HD: 350.00, PG: 160.00, BAC: 39.00
  };

  let count = 0;
  for (let day = 1; day <= 350; day++) {
    for (const sym of symbols) {
      count++;
      const base = basePrices[sym];
      const delta = (Math.sin(day + count) * 0.02) * base;
      const open = Math.round((base + delta) * 100) / 100;
      const high = Math.round((open * 1.015) * 100) / 100;
      const low = Math.round((open * 0.985) * 100) / 100;
      const close = Math.round((low + Math.random() * (high - low)) * 100) / 100;
      const volume = Math.floor(1000000 + Math.random() * 5000000);
      const dateStr = `2026-${String(Math.floor((day - 1) / 30) + 1).padStart(2, '0')}-${String(((day - 1) % 28) + 1).padStart(2, '0')}`;

      lines.push(`  { symbol: '${sym}', timestamp: '${dateStr}T16:00:00Z', open: ${open}, high: ${high}, low: ${low}, close: ${close}, volume: ${volume} },`);
      basePrices[sym] = close;
    }
  }

  lines.push('];');
  lines.push('');

  fs.writeFileSync(targetFile, lines.join('\n'), 'utf8');
  console.log(`Generated ${lines.length} lines of code in syntheticMarketSeriesDataset.ts`);
}

generateMarketSeries();
