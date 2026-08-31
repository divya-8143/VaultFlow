/**
 * Financial Math Utility Engine for VaultFlow
 */

export class FinancialMath {
  /**
   * Round to exact two decimal currency precision
   */
  public static round2(val: number): number {
    return Math.round((val + Number.EPSILON) * 100) / 100;
  }

  /**
   * Calculate Compound Interest
   * A = P * (1 + r/n)^(n*t)
   */
  public static calculateCompoundInterest(
    principal: number,
    annualRatePercentage: number,
    timesCompoundedPerYear: number,
    years: number
  ): number {
    const r = annualRatePercentage / 100;
    const n = timesCompoundedPerYear;
    const amount = principal * Math.pow(1 + r / n, n * years);
    return this.round2(amount);
  }

  /**
   * Calculate Monthly Savings Projection with Recurring Contributions
   */
  public static calculateFutureValueWithContributions(
    initialBalance: number,
    monthlyContribution: number,
    annualInterestRatePercentage: number,
    months: number
  ): { totalValue: number; totalContributions: number; totalInterestEarned: number } {
    const monthlyRate = annualInterestRatePercentage / 100 / 12;
    let balance = initialBalance;
    let totalContributions = initialBalance;

    for (let i = 0; i < months; i++) {
      balance += monthlyContribution;
      totalContributions += monthlyContribution;
      balance += balance * monthlyRate;
    }

    const totalValue = this.round2(balance);
    const totalInterestEarned = this.round2(totalValue - totalContributions);

    return {
      totalValue,
      totalContributions: this.round2(totalContributions),
      totalInterestEarned
    };
  }

  /**
   * Calculate Debt Snowball / Avalanche Months to Payoff
   */
  public static calculateDebtPayoffMonths(
    balance: number,
    annualInterestRatePercentage: number,
    monthlyPayment: number
  ): { months: number; totalInterestPaid: number } {
    if (balance <= 0) return { months: 0, totalInterestPaid: 0 };
    const monthlyRate = annualInterestRatePercentage / 100 / 12;
    
    // Check if payment covers monthly interest
    if (balance * monthlyRate >= monthlyPayment) {
      return { months: Infinity, totalInterestPaid: Infinity };
    }

    let remainingBalance = balance;
    let months = 0;
    let totalInterestPaid = 0;

    while (remainingBalance > 0 && months < 1200) { // capped at 100 years
      const interestForMonth = remainingBalance * monthlyRate;
      totalInterestPaid += interestForMonth;
      const principalPaid = monthlyPayment - interestForMonth;
      remainingBalance -= principalPaid;
      months++;
    }

    return {
      months,
      totalInterestPaid: this.round2(totalInterestPaid)
    };
  }

  /**
   * Calculate Budget Variance Percentage
   */
  public static calculateVariance(spent: number, budgetLimit: number): {
    varianceAmount: number;
    variancePercentage: number;
    isOverBudget: boolean;
  } {
    const varianceAmount = this.round2(budgetLimit - spent);
    const variancePercentage = budgetLimit > 0 ? this.round2((spent / budgetLimit) * 100) : 0;
    return {
      varianceAmount,
      variancePercentage,
      isOverBudget: spent > budgetLimit
    };
  }

  /**
   * Monte Carlo Portfolio Value Simulation
   */
  public static runMonteCarloSimulation(
    startingPortfolioValue: number,
    monthlyContribution: number,
    expectedAnnualReturn: number, // e.g. 7.5%
    annualVolatility: number,    // e.g. 15%
    years: number,
    numSimulations: number = 500
  ): {
    p10: number; // 10th percentile (pessimistic)
    p50: number; // 50th percentile (median)
    p90: number; // 90th percentile (optimistic)
    simulations: number[][];
  } {
    const months = years * 12;
    const monthlyMeanReturn = expectedAnnualReturn / 100 / 12;
    const monthlyStdDev = (annualVolatility / 100) / Math.sqrt(12);
    const results: number[] = [];
    const allSimulationsSample: number[][] = [];

    for (let sim = 0; sim < numSimulations; sim++) {
      let currentVal = startingPortfolioValue;
      const trajectory: number[] = [currentVal];

      for (let m = 0; m < months; m++) {
        // Box-Muller transform for normal distribution random sampling
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

        const monthlyReturn = monthlyMeanReturn + z0 * monthlyStdDev;
        currentVal = (currentVal + monthlyContribution) * (1 + monthlyReturn);
        if (currentVal < 0) currentVal = 0;
        trajectory.push(this.round2(currentVal));
      }

      results.push(this.round2(currentVal));
      if (sim < 5) {
        allSimulationsSample.push(trajectory);
      }
    }

    results.sort((a, b) => a - b);
    const p10Index = Math.floor(numSimulations * 0.1);
    const p50Index = Math.floor(numSimulations * 0.5);
    const p90Index = Math.floor(numSimulations * 0.9);

    return {
      p10: results[p10Index],
      p50: results[p50Index],
      p90: results[p90Index],
      simulations: allSimulationsSample
    };
  }
}
