import { FinancialMath } from '../core/utils/math';
import { Logger } from '../infrastructure/logger/logger';

function runBenchmark() {
  Logger.info('Starting VaultFlow Financial Math Benchmark...');
  
  const startTime = Date.now();
  const result = FinancialMath.runMonteCarloSimulation(100000, 1500, 8.0, 15.0, 30, 5000);
  const duration = Date.now() - startTime;

  Logger.info(`Monte Carlo Simulation Benchmark Completed in ${duration}ms`);
  Logger.info(`Simulated 5,000 trajectories over 30 years (1,800,000 data points):`);
  Logger.info(`P10 (Pessimistic 10th percentile): $${result.p10.toLocaleString()}`);
  Logger.info(`P50 (Median 50th percentile): $${result.p50.toLocaleString()}`);
  Logger.info(`P90 (Optimistic 90th percentile): $${result.p90.toLocaleString()}`);
}

runBenchmark();
