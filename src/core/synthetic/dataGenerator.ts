import { v4 as uuidv4 } from 'uuid';
import {
  User, UserRole, Account, AccountType, Transaction, TransactionType, TransactionCategory,
  Budget, BudgetPeriod, SavingsGoal, RecurringTransaction, RecurringFrequency, Alert, AlertCategory, AlertPriority, AuditLog
} from '../types';

export class SyntheticDataGenerator {
  private static SEED_USER_ID = 'u1111111-1111-4111-a111-111111111111';

  /**
   * Generate default synthetic user
   */
  public static generateUser(): User {
    return {
      id: this.SEED_USER_ID,
      email: 'alex.morgan@vaultflow.demo',
      fullName: 'Alex Morgan',
      role: UserRole.USER,
      baseCurrency: 'USD',
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      isActive: true,
      preferences: {
        theme: 'dark',
        emailAlerts: true,
        pushAlerts: true,
        budgetBreachNotificationThreshold: 85,
        monthlySummaryReport: true,
        dateFormat: 'YYYY-MM-DD'
      }
    };
  }

  /**
   * Generate synthetic bank accounts
   */
  public static generateAccounts(userId: string = this.SEED_USER_ID): Account[] {
    const now = new Date();
    return [
      {
        id: 'acc-checking-01',
        userId,
        name: 'Primary Checking Account',
        institutionName: 'Apex Premier Bank',
        type: AccountType.CHECKING,
        accountNumberMasked: '**** 4892',
        balance: 12480.50,
        currency: 'USD',
        minimumBalance: 500,
        isFavorite: true,
        isActive: true,
        createdAt: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
        updatedAt: now
      },
      {
        id: 'acc-savings-01',
        userId,
        name: 'High-Yield Savings (HYSA)',
        institutionName: 'Summit Trust Bank',
        type: AccountType.SAVINGS,
        accountNumberMasked: '**** 9104',
        balance: 45800.00,
        currency: 'USD',
        apyAprPercentage: 4.85,
        minimumBalance: 1000,
        isFavorite: true,
        isActive: true,
        createdAt: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
        updatedAt: now
      },
      {
        id: 'acc-credit-01',
        userId,
        name: 'Sapphire Reserve Credit Card',
        institutionName: 'Horizon Financial',
        type: AccountType.CREDIT_CARD,
        accountNumberMasked: '**** 7731',
        balance: -2150.30,
        currency: 'USD',
        apyAprPercentage: 21.99,
        creditLimit: 20000.00,
        isFavorite: true,
        isActive: true,
        createdAt: new Date(now.getTime() - 300 * 24 * 60 * 60 * 1000),
        updatedAt: now
      },
      {
        id: 'acc-investment-01',
        userId,
        name: 'Vanguard Index Investment Portfolio',
        institutionName: 'Vanguard Group',
        type: AccountType.INVESTMENT,
        accountNumberMasked: '**** 3312',
        balance: 128500.75,
        currency: 'USD',
        isFavorite: false,
        isActive: true,
        createdAt: new Date(now.getTime() - 500 * 24 * 60 * 60 * 1000),
        updatedAt: now
      },
      {
        id: 'acc-loan-01',
        userId,
        name: 'Auto Loan - Tesla Model Y',
        institutionName: 'Apex Premier Capital',
        type: AccountType.LOAN,
        accountNumberMasked: '**** 8820',
        balance: -18400.00,
        currency: 'USD',
        apyAprPercentage: 5.25,
        isFavorite: false,
        isActive: true,
        createdAt: new Date(now.getTime() - 400 * 24 * 60 * 60 * 1000),
        updatedAt: now
      }
    ];
  }

  /**
   * Generate 100+ synthetic historical transactions over past 6 months
   */
  public static generateTransactions(userId: string = this.SEED_USER_ID): Transaction[] {
    const transactions: Transaction[] = [];
    const now = new Date();

    const checkingId = 'acc-checking-01';
    const creditId = 'acc-credit-01';
    const savingsId = 'acc-savings-01';

    // 1. Bi-weekly Salary Payments
    for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
      const payDate1 = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
      const payDate2 = new Date(now.getFullYear(), now.getMonth() - monthOffset, 15);

      transactions.push({
        id: uuidv4(),
        userId,
        accountId: checkingId,
        type: TransactionType.INCOME,
        category: TransactionCategory.SALARY,
        amount: 4750.00,
        currency: 'USD',
        date: payDate1,
        merchantName: 'Acme Corp Payroll',
        description: 'Bi-weekly Direct Deposit Salary',
        tags: ['salary', 'income', 'direct-deposit'],
        isRecurring: true,
        status: 'CLEARED',
        createdAt: payDate1,
        updatedAt: payDate1
      });

      transactions.push({
        id: uuidv4(),
        userId,
        accountId: checkingId,
        type: TransactionType.INCOME,
        category: TransactionCategory.SALARY,
        amount: 4750.00,
        currency: 'USD',
        date: payDate2,
        merchantName: 'Acme Corp Payroll',
        description: 'Bi-weekly Direct Deposit Salary',
        tags: ['salary', 'income', 'direct-deposit'],
        isRecurring: true,
        status: 'CLEARED',
        createdAt: payDate2,
        updatedAt: payDate2
      });
    }

    // 2. Monthly Rent / Mortgage
    for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
      const rentDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 3);
      transactions.push({
        id: uuidv4(),
        userId,
        accountId: checkingId,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.HOUSING,
        amount: 2450.00,
        currency: 'USD',
        date: rentDate,
        merchantName: 'Skyline Luxury Apartments',
        description: 'Monthly Rent Payment',
        tags: ['rent', 'housing', 'fixed-expense'],
        isRecurring: true,
        status: 'CLEARED',
        createdAt: rentDate,
        updatedAt: rentDate
      });
    }

    // 3. Groceries, Dining, Utilities, Subscriptions, Gas, Shopping
    const expenseTemplates = [
      { merchant: 'Trader Joe\'s', cat: TransactionCategory.GROCERIES, min: 45, max: 140, acc: creditId, tags: ['groceries', 'food'] },
      { merchant: 'Whole Foods Market', cat: TransactionCategory.GROCERIES, min: 80, max: 210, acc: creditId, tags: ['groceries', 'food'] },
      { merchant: 'Starbucks Coffee', cat: TransactionCategory.DINING, min: 5.50, max: 14.50, acc: creditId, tags: ['coffee', 'dining'] },
      { merchant: 'Chipotle Mexican Grill', cat: TransactionCategory.DINING, min: 14.00, max: 32.00, acc: creditId, tags: ['dining', 'fast-food'] },
      { merchant: 'Chevron Gas Station', cat: TransactionCategory.TRANSPORTATION, min: 42.00, max: 68.00, acc: creditId, tags: ['gas', 'auto'] },
      { merchant: 'Uber Ride', cat: TransactionCategory.TRANSPORTATION, min: 18.50, max: 45.00, acc: creditId, tags: ['transit', 'uber'] },
      { merchant: 'Netflix Subscription', cat: TransactionCategory.ENTERTAINMENT, min: 19.99, max: 19.99, acc: creditId, tags: ['subscription', 'streaming'] },
      { merchant: 'Spotify Premium', cat: TransactionCategory.ENTERTAINMENT, min: 11.99, max: 11.99, acc: creditId, tags: ['subscription', 'music'] },
      { merchant: 'Amazon.com', cat: TransactionCategory.SHOPPING, min: 25.00, max: 180.00, acc: creditId, tags: ['shopping', 'online'] },
      { merchant: 'Electric & Power Co', cat: TransactionCategory.UTILITIES, min: 110.00, max: 185.00, acc: checkingId, tags: ['utilities', 'bills'] }
    ];

    for (let dayOffset = 1; dayOffset <= 120; dayOffset += 2) {
      const txDate = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
      const template = expenseTemplates[dayOffset % expenseTemplates.length];
      const amount = Math.round((template.min + Math.random() * (template.max - template.min)) * 100) / 100;

      transactions.push({
        id: uuidv4(),
        userId,
        accountId: template.acc,
        type: TransactionType.EXPENSE,
        category: template.cat,
        amount,
        currency: 'USD',
        date: txDate,
        merchantName: template.merchant,
        description: `Purchase at ${template.merchant}`,
        tags: template.tags,
        isRecurring: template.cat === TransactionCategory.ENTERTAINMENT,
        status: 'CLEARED',
        createdAt: txDate,
        updatedAt: txDate
      });
    }

    // 4. Monthly Savings Transfer
    for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
      const transferDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 16);
      transactions.push({
        id: uuidv4(),
        userId,
        accountId: checkingId,
        targetAccountId: savingsId,
        type: TransactionType.TRANSFER,
        category: TransactionCategory.SAVINGS_TRANSFER,
        amount: 1500.00,
        currency: 'USD',
        date: transferDate,
        merchantName: 'Internal Transfer to HYSA',
        description: 'Automated Monthly Savings Goal Transfer',
        tags: ['transfer', 'savings'],
        isRecurring: true,
        status: 'CLEARED',
        createdAt: transferDate,
        updatedAt: transferDate
      });
    }

    return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  /**
   * Generate synthetic envelope budgets
   */
  public static generateBudgets(userId: string = this.SEED_USER_ID): Budget[] {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return [
      {
        id: 'bgt-01',
        userId,
        name: 'Monthly Groceries Budget',
        category: TransactionCategory.GROCERIES,
        limitAmount: 750.00,
        currentSpent: 520.40,
        period: BudgetPeriod.MONTHLY,
        startDate: startOfMonth,
        endDate: endOfMonth,
        alertThresholdPercentage: 85,
        isStrictEnvelope: false,
        createdAt: startOfMonth,
        updatedAt: now
      },
      {
        id: 'bgt-02',
        userId,
        name: 'Dining & Outings',
        category: TransactionCategory.DINING,
        limitAmount: 400.00,
        currentSpent: 385.20,
        period: BudgetPeriod.MONTHLY,
        startDate: startOfMonth,
        endDate: endOfMonth,
        alertThresholdPercentage: 85,
        isStrictEnvelope: true,
        createdAt: startOfMonth,
        updatedAt: now
      },
      {
        id: 'bgt-03',
        userId,
        name: 'Utilities & Bills',
        category: TransactionCategory.UTILITIES,
        limitAmount: 350.00,
        currentSpent: 265.00,
        period: BudgetPeriod.MONTHLY,
        startDate: startOfMonth,
        endDate: endOfMonth,
        alertThresholdPercentage: 90,
        isStrictEnvelope: false,
        createdAt: startOfMonth,
        updatedAt: now
      },
      {
        id: 'bgt-04',
        userId,
        name: 'Entertainment & Leisure',
        category: TransactionCategory.ENTERTAINMENT,
        limitAmount: 250.00,
        currentSpent: 180.00,
        period: BudgetPeriod.MONTHLY,
        startDate: startOfMonth,
        endDate: endOfMonth,
        alertThresholdPercentage: 80,
        isStrictEnvelope: false,
        createdAt: startOfMonth,
        updatedAt: now
      }
    ];
  }

  /**
   * Generate synthetic savings goals
   */
  public static generateGoals(userId: string = this.SEED_USER_ID): SavingsGoal[] {
    const now = new Date();
    return [
      {
        id: 'goal-01',
        userId,
        name: 'Emergency Fund (6 Months Expenses)',
        targetAmount: 30000.00,
        currentAmount: 24500.00,
        targetDate: new Date(now.getFullYear(), now.getMonth() + 6, 1),
        category: 'Emergency Safety Net',
        monthlyContributionTarget: 1000.00,
        isAutoDepositEnabled: true,
        linkedAccountId: 'acc-savings-01',
        isCompleted: false,
        createdAt: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000),
        updatedAt: now
      },
      {
        id: 'goal-02',
        userId,
        name: 'European Summer Vacation 2027',
        targetAmount: 8500.00,
        currentAmount: 3800.00,
        targetDate: new Date(2027, 5, 15),
        category: 'Travel & Vacation',
        monthlyContributionTarget: 500.00,
        isAutoDepositEnabled: true,
        linkedAccountId: 'acc-savings-01',
        isCompleted: false,
        createdAt: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000),
        updatedAt: now
      }
    ];
  }

  /**
   * Generate synthetic recurring transactions
   */
  public static generateRecurring(userId: string = this.SEED_USER_ID): RecurringTransaction[] {
    const now = new Date();
    return [
      {
        id: 'rec-01',
        userId,
        accountId: 'acc-checking-01',
        merchantName: 'Acme Corp Payroll',
        amount: 4750.00,
        type: TransactionType.INCOME,
        category: TransactionCategory.SALARY,
        frequency: RecurringFrequency.BIWEEKLY,
        startDate: new Date(now.getFullYear(), 0, 1),
        nextDueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        autoProcess: true,
        isActive: true,
        createdAt: new Date(now.getFullYear(), 0, 1),
        updatedAt: now
      },
      {
        id: 'rec-02',
        userId,
        accountId: 'acc-checking-01',
        merchantName: 'Skyline Luxury Apartments',
        amount: 2450.00,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.HOUSING,
        frequency: RecurringFrequency.MONTHLY,
        startDate: new Date(now.getFullYear(), 0, 3),
        nextDueDate: new Date(now.getFullYear(), now.getMonth() + 1, 3),
        autoProcess: true,
        isActive: true,
        createdAt: new Date(now.getFullYear(), 0, 3),
        updatedAt: now
      },
      {
        id: 'rec-03',
        userId,
        accountId: 'acc-credit-01',
        merchantName: 'Netflix Subscription',
        amount: 19.99,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.ENTERTAINMENT,
        frequency: RecurringFrequency.MONTHLY,
        startDate: new Date(now.getFullYear(), 0, 12),
        nextDueDate: new Date(now.getFullYear(), now.getMonth(), 12),
        autoProcess: true,
        isActive: true,
        createdAt: new Date(now.getFullYear(), 0, 12),
        updatedAt: now
      }
    ];
  }

  /**
   * Generate synthetic alerts
   */
  public static generateAlerts(userId: string = this.SEED_USER_ID): Alert[] {
    const now = new Date();
    return [
      {
        id: 'alt-01',
        userId,
        category: AlertCategory.BUDGET_WARNING,
        priority: AlertPriority.MEDIUM,
        title: 'Budget Alert: Dining & Outings',
        message: 'You have spent 96% ($385.20 / $400.00) of your Dining budget for this month.',
        isRead: false,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000)
      },
      {
        id: 'alt-02',
        userId,
        category: AlertCategory.SAVINGS_MILESTONE,
        priority: AlertPriority.LOW,
        title: 'Milestone Reached!',
        message: 'Your Emergency Fund goal has reached 81% of its $30,000 target!',
        isRead: true,
        createdAt: new Date(now.getTime() - 48 * 60 * 60 * 1000)
      }
    ];
  }

  /**
   * Generate synthetic security & audit logs
   */
  public static generateAuditLogs(userId: string = this.SEED_USER_ID): AuditLog[] {
    const now = new Date();
    return [
      {
        id: 'log-01',
        userId,
        action: 'USER_LOGIN',
        resource: 'AUTH',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) VaultFlowClient/1.0',
        timestamp: new Date(now.getTime() - 10 * 60 * 1000),
        details: { method: 'JWT_BEARER', status: 'SUCCESS' }
      },
      {
        id: 'log-02',
        userId,
        action: 'CREATE_TRANSACTION',
        resource: 'TRANSACTION',
        resourceId: 'tx-10029',
        ipAddress: '192.168.1.100',
        userAgent: 'VaultFlowClient/1.0',
        timestamp: new Date(now.getTime() - 5 * 60 * 1000),
        details: { category: 'Dining & Restaurants', amount: 32.50 }
      }
    ];
  }
}
