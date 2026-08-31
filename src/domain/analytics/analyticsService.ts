import { CashFlowSummary, SpendingCategoryBreakdown, TransactionType, TransactionCategory } from '../../core/types';
import { Repository } from '../../infrastructure/database/repository';
import { AccountService } from '../accounts/accountService';
import { FinancialMath } from '../../core/utils/math';

export class AnalyticsService {
  private repo = Repository.getInstance();
  private accountService = new AccountService();

  public getCashFlowSummary(userId: string, monthsBack: number = 6): CashFlowSummary[] {
    const transactions = this.repo.getTransactions(userId);
    const summaries: Map<string, { income: number; expense: number }> = new Map();

    transactions.forEach(t => {
      const dateKey = `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, '0')}`;
      if (!summaries.has(dateKey)) {
        summaries.set(dateKey, { income: 0, expense: 0 });
      }

      const item = summaries.get(dateKey)!;
      if (t.type === TransactionType.INCOME) {
        item.income += t.amount;
      } else if (t.type === TransactionType.EXPENSE) {
        item.expense += t.amount;
      }
    });

    const result: CashFlowSummary[] = [];
    summaries.forEach((val, period) => {
      const netSavings = FinancialMath.round2(val.income - val.expense);
      const savingsRatePercentage = val.income > 0 ? FinancialMath.round2((netSavings / val.income) * 100) : 0;

      result.push({
        period,
        totalIncome: FinancialMath.round2(val.income),
        totalExpense: FinancialMath.round2(val.expense),
        netSavings,
        savingsRatePercentage
      });
    });

    return result.sort((a, b) => a.period.localeCompare(b.period)).slice(-monthsBack);
  }

  public getSpendingCategoryBreakdown(userId: string, startDate?: Date, endDate?: Date): SpendingCategoryBreakdown[] {
    let transactions = this.repo.getTransactions(userId).filter(t => t.type === TransactionType.EXPENSE);

    if (startDate) transactions = transactions.filter(t => new Date(t.date) >= startDate);
    if (endDate) transactions = transactions.filter(t => new Date(t.date) <= endDate);

    const totalExpenseAll = transactions.reduce((sum, t) => sum + t.amount, 0);
    const categoryMap: Map<TransactionCategory, { total: number; count: number }> = new Map();

    transactions.forEach(t => {
      if (!categoryMap.has(t.category)) {
        categoryMap.set(t.category, { total: 0, count: 0 });
      }
      const item = categoryMap.get(t.category)!;
      item.total += t.amount;
      item.count += 1;
    });

    const breakdown: SpendingCategoryBreakdown[] = [];
    categoryMap.forEach((val, cat) => {
      const totalSpent = FinancialMath.round2(val.total);
      const percentageOfTotal = totalExpenseAll > 0 ? FinancialMath.round2((totalSpent / totalExpenseAll) * 100) : 0;
      const averageTransactionAmount = val.count > 0 ? FinancialMath.round2(totalSpent / val.count) : 0;

      breakdown.push({
        category: cat,
        totalSpent,
        percentageOfTotal,
        transactionCount: val.count,
        averageTransactionAmount
      });
    });

    return breakdown.sort((a, b) => b.totalSpent - a.totalSpent);
  }

  public runMonteCarloWealthSimulation(userId: string, years: number = 20) {
    const netWorthPoint = this.accountService.calculateNetWorth(userId);
    const cashFlow = this.getCashFlowSummary(userId, 6);
    
    const avgMonthlySavings = cashFlow.length > 0 
      ? cashFlow.reduce((sum, c) => sum + c.netSavings, 0) / cashFlow.length 
      : 1000;

    return FinancialMath.runMonteCarloSimulation(
      netWorthPoint.netWorth,
      Math.max(100, avgMonthlySavings),
      7.5, // 7.5% annual return
      14.0, // 14% annual volatility
      years
    );
  }
}

// Financial Health Ratio Engine
export function calculateDebtToIncomeRatio(monthlyDebtPayments: number, grossMonthlyIncome: number): number {
  if (grossMonthlyIncome <= 0) return 0;
  return Math.round((monthlyDebtPayments / grossMonthlyIncome) * 10000) / 100;
}
