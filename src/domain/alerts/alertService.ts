import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertCategory, AlertPriority } from '../../core/types';
import { Repository } from '../../infrastructure/database/repository';
import { BudgetService } from '../budgets/budgetService';
import { AccountService } from '../accounts/accountService';
import { SYSTEM_DEFAULTS } from '../../core/constants';

export class AlertService {
  private repo = Repository.getInstance();
  private budgetService = new BudgetService();
  private accountService = new AccountService();

  public getAlerts(userId: string): Alert[] {
    return this.repo.getAlerts(userId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public markAsRead(alertId: string): boolean {
    const alert = this.repo.getAlerts().find(a => a.id === alertId);
    if (!alert) return false;
    alert.isRead = true;
    this.repo.saveAlert(alert);
    return true;
  }

  /**
   * Real-Time Alert Evaluation Engine
   */
  public evaluateAlerts(userId: string): Alert[] {
    const generatedAlerts: Alert[] = [];

    // 1. Budget Breach & Warning Evaluator
    const budgets = this.budgetService.getBudgets(userId);
    budgets.forEach(bgt => {
      const variance = this.budgetService.getBudgetVariance(bgt.id);
      if (variance.isOverBudget) {
        generatedAlerts.push({
          id: uuidv4(),
          userId,
          category: AlertCategory.BUDGET_EXCEEDED,
          priority: AlertPriority.HIGH,
          title: `Budget Exceeded: ${bgt.name}`,
          message: `You have spent $${bgt.currentSpent.toFixed(2)}, exceeding your limit of $${bgt.limitAmount.toFixed(2)} by $${Math.abs(variance.varianceAmount).toFixed(2)}.`,
          isRead: false,
          createdAt: new Date()
        });
      } else if (variance.variancePercentage >= bgt.alertThresholdPercentage) {
        generatedAlerts.push({
          id: uuidv4(),
          userId,
          category: AlertCategory.BUDGET_WARNING,
          priority: AlertPriority.MEDIUM,
          title: `Budget Warning: ${bgt.name}`,
          message: `You have reached ${variance.variancePercentage}% ($${bgt.currentSpent.toFixed(2)} / $${bgt.limitAmount.toFixed(2)}) of your budget.`,
          isRead: false,
          createdAt: new Date()
        });
      }
    });

    // 2. Low Account Balance Evaluator
    const accounts = this.accountService.getAllAccounts(userId);
    accounts.forEach(acc => {
      if (acc.balance < (acc.minimumBalance || SYSTEM_DEFAULTS.LOW_BALANCE_ALERT_THRESHOLD) && acc.balance >= 0) {
        generatedAlerts.push({
          id: uuidv4(),
          userId,
          category: AlertCategory.LOW_BALANCE,
          priority: AlertPriority.HIGH,
          title: `Low Balance Alert: ${acc.name}`,
          message: `Your account balance ($${acc.balance.toFixed(2)}) has fallen below minimum threshold ($${(acc.minimumBalance || SYSTEM_DEFAULTS.LOW_BALANCE_ALERT_THRESHOLD).toFixed(2)}).`,
          isRead: false,
          createdAt: new Date()
        });
      }
    });

    generatedAlerts.forEach(alt => this.repo.saveAlert(alt));
    return generatedAlerts;
  }
}

// Priority Alert Webhook Dispatcher
export function formatAlertWebhookPayload(alertId: string, priority: string, message: string) {
  return {
    event: 'ALERT_TRIGGERED',
    alertId,
    priority,
    message,
    dispatchedAt: new Date().toISOString()
  };
}
