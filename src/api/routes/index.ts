import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { AccountsController } from '../controllers/accountsController';
import { TransactionsController } from '../controllers/transactionsController';
import { BudgetsController } from '../controllers/budgetsController';
import { GoalsController } from '../controllers/goalsController';
import { RecurringController } from '../controllers/recurringController';
import { AnalyticsController } from '../controllers/analyticsController';
import { ReportsController } from '../controllers/reportsController';
import { AlertsController } from '../controllers/alertsController';
import { AdminController } from '../controllers/adminController';

const router = Router();
router.use(authMiddleware);

// Accounts
const accounts = new AccountsController();
router.get('/accounts', accounts.getAll);
router.get('/accounts/net-worth', accounts.getNetWorth);
router.get('/accounts/:id', accounts.getById);
router.post('/accounts', accounts.create);

// Transactions
const transactions = new TransactionsController();
router.get('/transactions', transactions.getTransactions);
router.post('/transactions', transactions.create);
router.post('/transactions/categorize', transactions.categorize);

// Budgets
const budgets = new BudgetsController();
router.get('/budgets', budgets.getBudgets);
router.post('/budgets', budgets.create);
router.get('/budgets/:id/variance', budgets.getVariance);

// Savings Goals
const goals = new GoalsController();
router.get('/goals', goals.getGoals);
router.post('/goals', goals.create);
router.post('/goals/:id/deposit', goals.deposit);

// Recurring Transactions
const recurring = new RecurringController();
router.get('/recurring', recurring.getRecurring);
router.post('/recurring', recurring.create);
router.post('/recurring/process', recurring.processBatch);

// Financial Analytics
const analytics = new AnalyticsController();
router.get('/analytics/cashflow', analytics.getCashFlow);
router.get('/analytics/categories', analytics.getCategoryBreakdown);
router.get('/analytics/monte-carlo', analytics.getMonteCarlo);

// Reports
const reports = new ReportsController();
router.get('/reports/summary', reports.getSummary);
router.get('/reports/export-csv', reports.exportCSV);

// Alerts
const alerts = new AlertsController();
router.get('/alerts', alerts.getAlerts);
router.post('/alerts/evaluate', alerts.evaluate);
router.post('/alerts/:id/read', alerts.markRead);

// Admin
const admin = new AdminController();
router.get('/admin/users', admin.getUsers);
router.get('/admin/audit-logs', admin.getAuditLogs);
router.post('/admin/seed', admin.resetSyntheticData);

export default router;
