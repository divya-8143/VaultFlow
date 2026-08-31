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
    const transactions = this.transactionService.getTransactions(userId, { limit: 15 }).items;
    const budgets = this.budgetService.getBudgets(userId);
    const goals = this.goalService.getGoals(userId);
    const alerts = this.alertService.getAlerts(userId).filter(a => !a.isRead);
    const cashFlow = this.analyticsService.getCashFlowSummary(userId, 6);
    const categoryBreakdown = this.analyticsService.getSpendingCategoryBreakdown(userId);
    const monteCarlo = this.analyticsService.runMonteCarloWealthSimulation(userId, 20);

    return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VaultFlow FinTech Platform Dashboard</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; }
    .glass-card { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    .modal-overlay { display: none; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(8px); }
    .modal-overlay.active { display: flex; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen relative">
  <!-- Top Navigation Bar -->
  <header class="border-b border-slate-800 bg-slate-900/80 sticky top-0 z-40 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <div>
          <span class="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-slate-100 bg-clip-text text-transparent">VaultFlow</span>
          <span class="text-xs px-2 py-0.5 ml-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">Enterprise v1.0</span>
        </div>
      </div>

      <!-- Center Nav Tabs -->
      <nav class="hidden md:flex items-center gap-1 bg-slate-800/50 p-1.5 rounded-xl border border-slate-700/50">
        <button onclick="switchTab('overview')" id="tab-overview" class="tab-btn active px-4 py-1.5 text-sm font-medium rounded-lg transition-all text-blue-400 bg-slate-700/70 shadow-sm">Overview</button>
        <button onclick="switchTab('accounts')" id="tab-accounts" class="tab-btn px-4 py-1.5 text-sm font-medium rounded-lg transition-all text-slate-400 hover:text-slate-200">Accounts</button>
        <button onclick="switchTab('transactions')" id="tab-transactions" class="tab-btn px-4 py-1.5 text-sm font-medium rounded-lg transition-all text-slate-400 hover:text-slate-200">Transactions</button>
        <button onclick="switchTab('budgets')" id="tab-budgets" class="tab-btn px-4 py-1.5 text-sm font-medium rounded-lg transition-all text-slate-400 hover:text-slate-200">Budgets & Goals</button>
        <button onclick="switchTab('analytics')" id="tab-analytics" class="tab-btn px-4 py-1.5 text-sm font-medium rounded-lg transition-all text-slate-400 hover:text-slate-200">Analytics</button>
        <button onclick="switchTab('reports')" id="tab-reports" class="tab-btn px-4 py-1.5 text-sm font-medium rounded-lg transition-all text-slate-400 hover:text-slate-200">Reports</button>
      </nav>

      <!-- User Info & Quick Action -->
      <div class="flex items-center gap-4">
        <div class="hidden sm:flex flex-col text-right">
          <span class="text-sm font-semibold text-slate-200">${user?.fullName}</span>
          <span class="text-xs text-slate-400">${user?.email}</span>
        </div>
        <button onclick="openModal('add-transaction-modal')" class="px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          + New Entry
        </button>
      </div>
    </div>
  </header>

  <!-- Main Container -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    ${alerts.length > 0 ? `
    <!-- System Alert Banner -->
    <div class="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="p-2 rounded-xl bg-amber-500/20 text-amber-400">🔔</span>
        <div>
          <h4 class="font-semibold text-sm">${alerts[0].title}</h4>
          <p class="text-xs text-amber-300/80">${alerts[0].message}</p>
        </div>
      </div>
      <button onclick="dismissAlert('${alerts[0].id}')" class="text-xs px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 font-medium">Dismiss</button>
    </div>
    ` : ''}

    <!-- TAB 1: OVERVIEW -->
    <div id="view-overview" class="tab-content active space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="glass-card rounded-2xl p-5 relative overflow-hidden">
          <div class="flex justify-between items-start">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Net Worth</span>
            <span class="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">💰</span>
          </div>
          <div class="text-3xl font-bold mt-3 text-slate-100">${CurrencyUtils.format(netWorth.netWorth, user?.baseCurrency)}</div>
          <div class="mt-3 flex items-center gap-2 text-xs">
            <span class="text-emerald-400 font-semibold flex items-center">+4.8%</span>
            <span class="text-slate-400">vs last month</span>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-800 text-xs flex justify-between text-slate-400">
            <span>Assets: ${CurrencyUtils.format(netWorth.assets, user?.baseCurrency)}</span>
            <span>Liabilities: ${CurrencyUtils.format(netWorth.liabilities, user?.baseCurrency)}</span>
          </div>
        </div>

        <div class="glass-card rounded-2xl p-5 relative overflow-hidden">
          <div class="flex justify-between items-start">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Savings Rate</span>
            <span class="p-2 rounded-xl bg-blue-500/10 text-blue-400">📈</span>
          </div>
          <div class="text-3xl font-bold mt-3 text-slate-100">${cashFlow[cashFlow.length - 1]?.savingsRatePercentage || 0}%</div>
          <div class="mt-3 flex items-center gap-2 text-xs">
            <span class="text-blue-400 font-semibold">Net +${CurrencyUtils.format(cashFlow[cashFlow.length - 1]?.netSavings || 0)}</span>
            <span class="text-slate-400">saved</span>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-800 text-xs flex justify-between text-slate-400">
            <span>Income: ${CurrencyUtils.format(cashFlow[cashFlow.length - 1]?.totalIncome || 0)}</span>
            <span>Spent: ${CurrencyUtils.format(cashFlow[cashFlow.length - 1]?.totalExpense || 0)}</span>
          </div>
        </div>

        <div class="glass-card rounded-2xl p-5 relative overflow-hidden">
          <div class="flex justify-between items-start">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Primary Checking</span>
            <span class="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">💳</span>
          </div>
          <div class="text-3xl font-bold mt-3 text-slate-100">${CurrencyUtils.format(accounts[0]?.balance || 0)}</div>
          <div class="mt-3 text-xs text-slate-400">Account ${accounts[0]?.accountNumberMasked}</div>
          <div class="mt-4 pt-3 border-t border-slate-800 text-xs flex justify-between text-slate-400">
            <span>Institution: Apex Bank</span>
            <span class="text-emerald-400">Healthy</span>
          </div>
        </div>

        <div class="glass-card rounded-2xl p-5 relative overflow-hidden">
          <div class="flex justify-between items-start">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">HYSA Savings (4.85% APY)</span>
            <span class="p-2 rounded-xl bg-amber-500/10 text-amber-400">⚡</span>
          </div>
          <div class="text-3xl font-bold mt-3 text-slate-100">${CurrencyUtils.format(accounts[1]?.balance || 0)}</div>
          <div class="mt-3 text-xs text-emerald-400 font-semibold">+${CurrencyUtils.format((accounts[1]?.balance || 0) * (0.0485 / 12))} est. monthly yield</div>
          <div class="mt-4 pt-3 border-t border-slate-800 text-xs flex justify-between text-slate-400">
            <span>Summit Trust Bank</span>
            <span class="text-amber-400">Auto-Deposit</span>
          </div>
        </div>
      </div>

      <!-- Main Visualizations Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="glass-card rounded-2xl p-6 lg:col-span-2">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="font-bold text-lg text-slate-100">Monthly Cash Flow Trend</h3>
              <p class="text-xs text-slate-400">Historical Income vs Expense Breakdown (Past 6 Months)</p>
            </div>
            <div class="flex items-center gap-4 text-xs font-medium">
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-emerald-500"></span> Income</span>
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-rose-500"></span> Expenses</span>
            </div>
          </div>
          
          <div class="h-64 w-full flex items-end justify-between gap-4 pt-4 px-2">
            ${cashFlow.map(c => `
              <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div class="w-full flex items-end justify-center gap-1.5 h-48">
                  <div style="height: ${Math.min(100, (c.totalIncome / 10000) * 100)}%;" class="w-1/2 bg-emerald-500/80 group-hover:bg-emerald-400 rounded-t-md transition-all"></div>
                  <div style="height: ${Math.min(100, (c.totalExpense / 10000) * 100)}%;" class="w-1/2 bg-rose-500/80 group-hover:bg-rose-400 rounded-t-md transition-all"></div>
                </div>
                <span class="text-xs font-medium text-slate-400">${c.period}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="glass-card rounded-2xl p-6">
          <h3 class="font-bold text-lg text-slate-100 mb-1">Spending Categories</h3>
          <p class="text-xs text-slate-400 mb-6">Top Expenditure Allocations</p>
          
          <div class="space-y-4">
            ${categoryBreakdown.slice(0, 5).map(cat => `
              <div>
                <div class="flex justify-between text-xs font-medium mb-1.5">
                  <span class="text-slate-300">${cat.category}</span>
                  <span class="text-slate-400">${CurrencyUtils.format(cat.totalSpent)} (${cat.percentageOfTotal}%)</span>
                </div>
                <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div style="width: ${cat.percentageOfTotal}%;" class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Recent Transactions Activity -->
      <div class="glass-card rounded-2xl p-6">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="font-bold text-lg text-slate-100">Recent Transactions</h3>
            <p class="text-xs text-slate-400">Latest Account Ledger Entries</p>
          </div>
          <button onclick="switchTab('transactions')" class="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">View All &rarr;</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-300">
            <thead class="text-xs uppercase bg-slate-900/50 text-slate-400 border-b border-slate-800">
              <tr>
                <th class="py-3 px-4">Date</th>
                <th class="py-3 px-4">Merchant</th>
                <th class="py-3 px-4">Category</th>
                <th class="py-3 px-4">Type</th>
                <th class="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/50">
              ${transactions.slice(0, 7).map(t => `
                <tr class="hover:bg-slate-800/30 transition-colors">
                  <td class="py-3.5 px-4 text-xs font-medium text-slate-400">${new Date(t.date).toISOString().split('T')[0]}</td>
                  <td class="py-3.5 px-4 font-semibold text-slate-200">${t.merchantName}</td>
                  <td class="py-3.5 px-4"><span class="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">${t.category}</span></td>
                  <td class="py-3.5 px-4 text-xs font-semibold ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-slate-400'}">${t.type}</td>
                  <td class="py-3.5 px-4 text-right font-bold ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-slate-200'}">${t.type === 'EXPENSE' ? '-' : '+'}${CurrencyUtils.format(t.amount, t.currency)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 2: ACCOUNTS -->
    <div id="view-accounts" class="tab-content space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-slate-100">Financial Accounts</h2>
          <p class="text-xs text-slate-400">Managed Banking Institutions, Credit Cards & Investment Portfolios</p>
        </div>
        <button onclick="openModal('add-account-modal')" class="px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md">Add Bank Account</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${accounts.map(acc => `
          <div class="glass-card rounded-2xl p-6 space-y-4">
            <div class="flex justify-between items-start">
              <div>
                <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-blue-400 border border-slate-700">${acc.type}</span>
                <h3 class="font-bold text-lg text-slate-100 mt-2">${acc.name}</h3>
                <p class="text-xs text-slate-400">${acc.institutionName} (${acc.accountNumberMasked})</p>
              </div>
              <span class="text-xl">${acc.balance >= 0 ? '🏦' : '💳'}</span>
            </div>
            
            <div class="pt-2">
              <span class="text-xs text-slate-400">Current Balance</span>
              <div class="text-2xl font-bold ${acc.balance >= 0 ? 'text-slate-100' : 'text-rose-400'}">${CurrencyUtils.format(acc.balance, acc.currency)}</div>
            </div>

            ${acc.apyAprPercentage ? `
              <div class="text-xs text-slate-400 flex justify-between border-t border-slate-800/80 pt-3">
                <span>Interest Rate (${acc.balance >= 0 ? 'APY' : 'APR'})</span>
                <span class="font-semibold text-emerald-400">${acc.apyAprPercentage}%</span>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>

    <!-- TAB 3: TRANSACTIONS -->
    <div id="view-transactions" class="tab-content space-y-6">
      <div class="glass-card rounded-2xl p-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 class="text-xl font-bold text-slate-100">Transaction Ledger</h2>
            <p class="text-xs text-slate-400">Search, filter, and audit income and expenses</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-300">
            <thead class="text-xs uppercase bg-slate-900/50 text-slate-400 border-b border-slate-800">
              <tr>
                <th class="py-3 px-4">Date</th>
                <th class="py-3 px-4">Merchant Name</th>
                <th class="py-3 px-4">Category</th>
                <th class="py-3 px-4">Type</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/50">
              ${transactions.map(t => `
                <tr class="hover:bg-slate-800/30 transition-colors">
                  <td class="py-3.5 px-4 text-xs text-slate-400">${new Date(t.date).toISOString().split('T')[0]}</td>
                  <td class="py-3.5 px-4 font-semibold text-slate-200">${t.merchantName}</td>
                  <td class="py-3.5 px-4"><span class="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">${t.category}</span></td>
                  <td class="py-3.5 px-4 text-xs font-semibold ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-slate-400'}">${t.type}</td>
                  <td class="py-3.5 px-4 text-xs"><span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-medium">CLEARED</span></td>
                  <td class="py-3.5 px-4 text-right font-bold ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-slate-200'}">${t.type === 'EXPENSE' ? '-' : '+'}${CurrencyUtils.format(t.amount, t.currency)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 4: BUDGETS & GOALS -->
    <div id="view-budgets" class="tab-content space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="glass-card rounded-2xl p-6 space-y-6">
          <div>
            <h2 class="text-xl font-bold text-slate-100">Category Budgets</h2>
            <p class="text-xs text-slate-400">Monthly Envelope Budget Progress</p>
          </div>

          <div class="space-y-5">
            ${budgets.map(b => {
              const pct = Math.min(100, Math.round((b.currentSpent / b.limitAmount) * 100));
              const isOver = b.currentSpent > b.limitAmount;
              return `
                <div class="space-y-2">
                  <div class="flex justify-between items-center text-sm font-medium">
                    <span class="text-slate-200">${b.name}</span>
                    <span class="${isOver ? 'text-rose-400 font-bold' : 'text-slate-300'}">${CurrencyUtils.format(b.currentSpent)} / ${CurrencyUtils.format(b.limitAmount)} (${pct}%)</span>
                  </div>
                  <div class="w-full h-3 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-slate-800">
                    <div style="width: ${pct}%;" class="h-full rounded-full transition-all ${isOver ? 'bg-rose-500' : pct > 85 ? 'bg-amber-500' : 'bg-blue-500'}"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="glass-card rounded-2xl p-6 space-y-6">
          <div>
            <h2 class="text-xl font-bold text-slate-100">Savings Goals</h2>
            <p class="text-xs text-slate-400">Milestone Wealth Target Planning</p>
          </div>

          <div class="space-y-5">
            ${goals.map(g => {
              const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
              return `
                <div class="space-y-2 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div class="flex justify-between items-center">
                    <h4 class="font-bold text-slate-200">🎯 ${g.name}</h4>
                    <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">${pct}% Target</span>
                  </div>
                  <div class="flex justify-between text-xs text-slate-400 pt-1">
                    <span>Target Amount: ${CurrencyUtils.format(g.targetAmount)}</span>
                    <span class="text-emerald-400 font-semibold">Current: ${CurrencyUtils.format(g.currentAmount)}</span>
                  </div>
                  <div class="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div style="width: ${pct}%;" class="h-full bg-emerald-500 rounded-full"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 5: ENHANCED ANALYTICS PAGE -->
    <div id="view-analytics" class="tab-content space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 class="text-2xl font-bold text-slate-100">Financial Analytics & Wealth Projections</h2>
          <p class="text-xs text-slate-400">Monte Carlo Simulations, Spending Velocity & Risk Health Indicators</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">5,000 Trajectories Run</span>
        </div>
      </div>

      <!-- Monte Carlo Percentiles Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div class="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div class="flex justify-between items-start">
            <span class="text-xs font-semibold uppercase tracking-wider text-amber-400">P10 (Pessimistic 10th %)</span>
            <span class="p-2 rounded-xl bg-amber-500/10 text-amber-400">🛡️</span>
          </div>
          <div class="text-3xl font-bold text-amber-400 mt-3">${CurrencyUtils.format(monteCarlo.p10)}</div>
          <p class="text-xs text-slate-400 mt-2">20-Year Value under high volatility market corrections</p>
        </div>

        <div class="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div class="flex justify-between items-start">
            <span class="text-xs font-semibold uppercase tracking-wider text-blue-400">P50 (Expected Median)</span>
            <span class="p-2 rounded-xl bg-blue-500/10 text-blue-400">🎯</span>
          </div>
          <div class="text-3xl font-bold text-blue-400 mt-3">${CurrencyUtils.format(monteCarlo.p50)}</div>
          <p class="text-xs text-slate-400 mt-2">Expected 20-year wealth at 7.5% average annual return</p>
        </div>

        <div class="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div class="flex justify-between items-start">
            <span class="text-xs font-semibold uppercase tracking-wider text-emerald-400">P90 (Optimistic 90th %)</span>
            <span class="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">🚀</span>
          </div>
          <div class="text-3xl font-bold text-emerald-400 mt-3">${CurrencyUtils.format(monteCarlo.p90)}</div>
          <p class="text-xs text-slate-400 mt-2">Upper quartile growth projection under strong bull markets</p>
        </div>
      </div>

      <!-- Financial Health & Risk Indicators Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 20-Year Growth Trajectory SVG Chart -->
        <div class="glass-card rounded-2xl p-6 lg:col-span-2 space-y-4">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-bold text-lg text-slate-100">20-Year Growth Curves</h3>
              <p class="text-xs text-slate-400">Monte Carlo Simulated Portfolio Growth Over Time</p>
            </div>
            <div class="flex items-center gap-4 text-xs font-medium">
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-emerald-400"></span> P90</span>
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-blue-400"></span> P50</span>
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-amber-400"></span> P10</span>
            </div>
          </div>

          <!-- SVG Trajectory Curve -->
          <div class="h-64 w-full pt-4 relative">
            <svg class="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              <!-- Grid lines -->
              <line x1="0" y1="40" x2="500" y2="40" stroke="#334155" stroke-dasharray="4" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#334155" stroke-dasharray="4" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#334155" stroke-dasharray="4" />

              <!-- P90 Curve (Emerald) -->
              <path d="M 0,180 Q 150,150 250,90 T 500,20" fill="none" stroke="#34d399" stroke-width="3" />

              <!-- P50 Curve (Blue) -->
              <path d="M 0,180 Q 150,160 250,120 T 500,60" fill="none" stroke="#60a5fa" stroke-width="3" />

              <!-- P10 Curve (Amber) -->
              <path d="M 0,180 Q 150,170 250,145 T 500,105" fill="none" stroke="#fbbf24" stroke-width="3" />
            </svg>
            <div class="flex justify-between text-xs text-slate-400 mt-2 font-medium">
              <span>Year 0</span>
              <span>Year 5</span>
              <span>Year 10</span>
              <span>Year 15</span>
              <span>Year 20</span>
            </div>
          </div>
        </div>

        <!-- Health Metrics & Asset Allocation -->
        <div class="glass-card rounded-2xl p-6 space-y-5">
          <h3 class="font-bold text-lg text-slate-100">Financial Health Ratios</h3>
          
          <div class="space-y-4">
            <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div class="flex justify-between text-xs font-semibold">
                <span class="text-slate-300">Emergency Liquidity Coverage</span>
                <span class="text-emerald-400">6.2 Months</span>
              </div>
              <p class="text-xs text-slate-400">Covers 6+ months of living expenses in HYSA & Checking</p>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div class="flex justify-between text-xs font-semibold">
                <span class="text-slate-300">Debt-to-Income (DTI)</span>
                <span class="text-emerald-400">22.4% (Healthy)</span>
              </div>
              <p class="text-xs text-slate-400">Well below the 36% recommended risk threshold</p>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div class="flex justify-between text-xs font-semibold">
                <span class="text-slate-300">Spending Velocity</span>
                <span class="text-blue-400">$116.40 / Day</span>
              </div>
              <p class="text-xs text-slate-400">Average daily burn rate for current month</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 6: REPORTS -->
    <div id="view-reports" class="tab-content space-y-6">
      <div class="glass-card rounded-2xl p-6 space-y-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-bold text-slate-100">Executive Financial Report</h2>
            <p class="text-xs text-slate-400">Monthly P&L, Tax Deduction Summary & Ledger Export</p>
          </div>
          <a href="/api/v1/reports/export-csv" class="px-4 py-2 text-sm font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2">
            📥 Download CSV Export
          </a>
        </div>
      </div>
    </div>
  </main>

  <!-- MODAL: ADD TRANSACTION -->
  <div id="add-transaction-modal" class="modal-overlay fixed inset-0 z-50 items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-bold text-slate-100">Add New Transaction</h3>
        <button onclick="closeModal('add-transaction-modal')" class="text-slate-400 hover:text-slate-200 text-xl font-bold">&times;</button>
      </div>

      <form id="tx-form" onsubmit="submitTransaction(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">Account</label>
          <select id="tx-accountId" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500">
            ${accounts.map(a => `<option value="${a.id}">${a.name} (${a.accountNumberMasked})</option>`).join('')}
          </select>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1">Type</label>
            <select id="tx-type" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500">
              <option value="EXPENSE">EXPENSE</option>
              <option value="INCOME">INCOME</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1">Amount ($)</label>
            <input type="number" step="0.01" id="tx-amount" required placeholder="0.00" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">Merchant / Payee Name</label>
          <input type="text" id="tx-merchantName" required placeholder="e.g. Trader Joe's, Starbucks" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">Category</label>
          <select id="tx-category" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500">
            <option value="Groceries & Supermarket">Groceries & Supermarket</option>
            <option value="Dining & Restaurants">Dining & Restaurants</option>
            <option value="Housing & Rent">Housing & Rent</option>
            <option value="Utilities & Bills">Utilities & Bills</option>
            <option value="Transportation & Gas">Transportation & Gas</option>
            <option value="Entertainment & Streaming">Entertainment & Streaming</option>
            <option value="Shopping & Apparel">Shopping & Apparel</option>
            <option value="Salary & Wages">Salary & Wages</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button type="button" onclick="closeModal('add-transaction-modal')" class="px-4 py-2 text-sm font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700">Cancel</button>
          <button type="submit" class="px-4 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md">Save Transaction</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    function switchTab(tabName) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active', 'text-blue-400', 'bg-slate-700/70', 'shadow-sm'));
      
      document.getElementById('view-' + tabName).classList.add('active');
      const btn = document.getElementById('tab-' + tabName);
      if (btn) btn.classList.add('active', 'text-blue-400', 'bg-slate-700/70', 'shadow-sm');
    }

    function openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.add('active');
    }

    function closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.remove('active');
    }

    async function submitTransaction(e) {
      e.preventDefault();
      const accountId = document.getElementById('tx-accountId').value;
      const type = document.getElementById('tx-type').value;
      const amount = parseFloat(document.getElementById('tx-amount').value);
      const merchantName = document.getElementById('tx-merchantName').value;
      const category = document.getElementById('tx-category').value;

      try {
        const res = await fetch('/api/v1/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accountId,
            type,
            amount,
            merchantName,
            category,
            date: new Date().toISOString()
          })
        });

        const data = await res.json();
        if (data.success) {
          closeModal('add-transaction-modal');
          location.reload();
        } else {
          alert('Error creating transaction: ' + data.error);
        }
      } catch (err) {
        alert('Failed to connect to server');
      }
    }

    function dismissAlert(alertId) {
      fetch('/api/v1/alerts/' + alertId + '/read', { method: 'POST' });
      location.reload();
    }
  </script>
</body>
</html>`;
  }
}
