import { Repository } from '../../infrastructure/database/repository';
import { AccountService } from '../accounts/accountService';
import { AnalyticsService } from '../analytics/analyticsService';
import { CurrencyUtils } from '../../core/utils/currency';

export class ReportService {
  private repo = Repository.getInstance();
  private accountService = new AccountService();
  private analyticsService = new AnalyticsService();

  public generateExecutiveSummary(userId: string) {
    const user = this.repo.getUserById(userId);
    const netWorth = this.accountService.calculateNetWorth(userId);
    const cashFlows = this.analyticsService.getCashFlowSummary(userId, 1);
    const recentCashFlow = cashFlows[0] || { totalIncome: 0, totalExpense: 0, netSavings: 0, savingsRatePercentage: 0 };
    const categoryBreakdown = this.analyticsService.getSpendingCategoryBreakdown(userId);

    return {
      title: 'Executive Financial Performance Summary',
      generatedFor: user?.fullName || 'Valued User',
      generatedAt: new Date().toISOString(),
      baseCurrency: user?.baseCurrency || 'USD',
      netWorth: {
        totalAssets: CurrencyUtils.format(netWorth.assets, user?.baseCurrency),
        totalLiabilities: CurrencyUtils.format(netWorth.liabilities, user?.baseCurrency),
        netWorthTotal: CurrencyUtils.format(netWorth.netWorth, user?.baseCurrency)
      },
      currentMonthPerformance: {
        income: CurrencyUtils.format(recentCashFlow.totalIncome, user?.baseCurrency),
        expense: CurrencyUtils.format(recentCashFlow.totalExpense, user?.baseCurrency),
        netSavings: CurrencyUtils.format(recentCashFlow.netSavings, user?.baseCurrency),
        savingsRate: `${recentCashFlow.savingsRatePercentage}%`
      },
      topExpenseCategories: categoryBreakdown.slice(0, 5).map(c => ({
        category: c.category,
        amount: CurrencyUtils.format(c.totalSpent, user?.baseCurrency),
        percentage: `${c.percentageOfTotal}%`
      }))
    };
  }

  public exportTransactionsCSV(userId: string): string {
    const transactions = this.repo.getTransactions(userId);
    const headers = ['ID', 'Date', 'Type', 'Category', 'Merchant', 'Amount', 'Currency', 'Status', 'Tags'];

    const rows = transactions.map(t => [
      t.id,
      t.date.toISOString().split('T')[0],
      t.type,
      `"${t.category}"`,
      `"${t.merchantName}"`,
      t.amount.toFixed(2),
      t.currency,
      t.status,
      `"${t.tags.join(';')}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}
