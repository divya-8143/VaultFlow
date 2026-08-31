/**
 * Multi-Year Synthetic Economic & Financial Market Index Time-Series Data Generator
 */

export interface MarketIndexPoint {
  date: string;
  sp500Index: number;
  nasdaqIndex: number;
  cpiInflationRate: number; // annual %
  treasury10YrYield: number; // %
  fedFundsRate: number; // %
}

export class HistoricalMarketDataSeries {
  /**
   * Generate 10 years of monthly historical market index points (120 data points)
   */
  public static generateMonthlySeries(startYear: number = 2016, endYear: number = 2026): MarketIndexPoint[] {
    const series: MarketIndexPoint[] = [];

    let sp500 = 2100.00;
    let nasdaq = 5000.00;
    let cpi = 2.1;
    let treasury10yr = 2.25;
    let fedRate = 0.50;

    for (let year = startYear; year <= endYear; year++) {
      for (let month = 1; month <= 12; month++) {
        // Deterministic macro-economic scenario modeling
        const dateStr = `${year}-${String(month).padStart(2, '0')}-01`;

        // 2020 COVID Market Crash & Recovery Simulation
        if (year === 2020 && (month === 2 || month === 3)) {
          sp500 *= 0.85;
          nasdaq *= 0.88;
          fedRate = 0.25;
          cpi = 1.2;
        } else if (year === 2022) {
          // Inflation spike & Fed rate hikes
          cpi = 7.5 + (month * 0.1);
          fedRate = 0.25 + (month * 0.35);
          sp500 *= 0.985;
          nasdaq *= 0.975;
          treasury10yr = 3.5 + (month * 0.05);
        } else {
          // Normal growth trend
          const monthlyReturnSP = 0.006 + (Math.sin(year + month) * 0.015);
          const monthlyReturnNasdaq = 0.009 + (Math.cos(year + month) * 0.02);

          sp500 *= (1 + monthlyReturnSP);
          nasdaq *= (1 + monthlyReturnNasdaq);
          cpi = Math.max(1.8, Math.min(3.5, 2.2 + Math.sin(month) * 0.4));
          fedRate = Math.max(0.25, Math.min(5.25, fedRate));
          treasury10yr = 3.8 + Math.sin(year) * 0.5;
        }

        series.push({
          date: dateStr,
          sp500Index: Math.round(sp500 * 100) / 100,
          nasdaqIndex: Math.round(nasdaq * 100) / 100,
          cpiInflationRate: Math.round(cpi * 100) / 100,
          treasury10YrYield: Math.round(treasury10yr * 100) / 100,
          fedFundsRate: Math.round(fedRate * 100) / 100
        });

        if (year === 2026 && month === 8) break;
      }
    }

    return series;
  }
}
