import { Repository } from '../infrastructure/database/repository';
import { AccountService } from '../domain/accounts/accountService';
import { TransactionService } from '../domain/transactions/transactionService';
import { BudgetService } from '../domain/budgets/budgetService';
import { GoalService } from '../domain/goals/goalService';
import { AnalyticsService } from '../domain/analytics/analyticsService';
import { AlertService } from '../domain/alerts/alertService';
import { CurrencyUtils } from '../core/utils/currency';

export class DashboardApp {
  private repo = Repository.getInstance();
  private accountService = new AccountService();
  private transactionService = new TransactionService();
  private budgetService = new BudgetService();
  private goalService = new GoalService();
  private analyticsService = new AnalyticsService();
  private alertService = new AlertService();

  public renderDashboardHTML(userId: string): string {
    const user = this.repo.getUserById(userId);
    const netWorth = this.accountService.calculateNetWorth(userId);
    const accounts = this.accountService.getAllAccounts(userId);
    const transactions = this.transactionService.getTransactions(userId, { limit: 10 }).items;
    const budgets = this.budgetService.getBudgets(userId);
    const goals = this.goalService.getGoals(userId);
    const alerts = this.alertService.getAlerts(userId).filter(a => !a.isRead);
    const cashFlow = this.analyticsService.getCashFlowSummary(userId, 6);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VaultFlow FinTech Dashboard</title>
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --accent: #3b82f6;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --border: #334155;
    }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: var(--bg); color: var(--text); margin: 0; padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 15px; margin-bottom: 25px; }
    .logo { font-size: 24px; font-weight: bold; color: var(--accent); display: flex; align-items: center; gap: 10px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-bottom: 25px; }
    .card { background-color: var(--card-bg); border: 1px solid var(--border); border-radius: 10px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .card h3 { margin-top: 0; color: var(--text-muted); font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; }
    .stat { font-size: 28px; font-weight: bold; margin: 10px 0; color: var(--text); }
    .positive { color: var(--success); }
    .negative { color: var(--danger); }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { text-align: left; padding: 12px; border-bottom: 1px solid var(--border); font-size: 14px; }
    th { color: var(--text-muted); font-weight: 600; }
    .progress-bar { background: var(--border); border-radius: 6px; height: 10px; overflow: hidden; margin-top: 8px; }
    .progress-fill { background: var(--accent); height: 100%; }
    .alert-banner { background: #451a03; border: 1px solid #b45309; color: #fef3c7; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">⚡ VaultFlow FinTech</div>
    <div>Welcome, <strong>${user?.fullName}</strong> (${user?.email})</div>
  </div>

  ${alerts.length > 0 ? `
    <div class="alert-banner">
      <span>🔔 <strong>${alerts[0].title}</strong>: ${alerts[0].message}</span>
    </div>
  ` : ''}

  <div class="grid">
    <div class="card">
      <h3>Total Net Worth</h3>
      <div class="stat positive">${CurrencyUtils.format(netWorth.netWorth, user?.baseCurrency)}</div>
      <div>Assets: ${CurrencyUtils.format(netWorth.assets, user?.baseCurrency)} | Liabilities: ${CurrencyUtils.format(netWorth.liabilities, user?.baseCurrency)}</div>
    </div>
    <div class="card">
      <h3>Active Accounts</h3>
      <div class="stat">${accounts.length} Accounts</div>
      <div>Primary Checking: ${CurrencyUtils.format(accounts[0]?.balance || 0)}</div>
    </div>
    <div class="card">
      <h3>Monthly Cash Flow</h3>
      <div class="stat positive">+${CurrencyUtils.format(cashFlow[cashFlow.length - 1]?.netSavings || 0)}</div>
      <div>Savings Rate: ${cashFlow[cashFlow.length - 1]?.savingsRatePercentage || 0}%</div>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <h3>Active Budgets</h3>
      ${budgets.map(b => `
        <div style="margin-bottom: 15px;">
          <div style="display:flex; justify-content:space-between;">
            <span>${b.name}</span>
            <span>${CurrencyUtils.format(b.currentSpent)} / ${CurrencyUtils.format(b.limitAmount)}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${Math.min(100, (b.currentSpent / b.limitAmount) * 100)}%;"></div>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="card">
      <h3>Savings Goals Progress</h3>
      ${goals.map(g => `
        <div style="margin-bottom: 15px;">
          <div style="display:flex; justify-content:space-between;">
            <span>🎯 ${g.name}</span>
            <span>${CurrencyUtils.format(g.currentAmount)} / ${CurrencyUtils.format(g.targetAmount)}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${Math.min(100, (g.currentAmount / g.targetAmount) * 100)}%; background: var(--success);"></div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="card">
    <h3>Recent Transaction Activity</h3>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Merchant</th>
          <th>Category</th>
          <th>Type</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        ${transactions.map(t => `
          <tr>
            <td>${t.date.toISOString().split('T')[0]}</td>
            <td><strong>${t.merchantName}</strong></td>
            <td>${t.category}</td>
            <td>${t.type}</td>
            <td class="${t.type === 'INCOME' ? 'positive' : ''}">${t.type === 'EXPENSE' ? '-' : '+'}${CurrencyUtils.format(t.amount, t.currency)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>
    `;
  }
}
