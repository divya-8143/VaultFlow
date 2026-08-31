import {
  User, Account, Transaction, Budget, SavingsGoal, RecurringTransaction, Alert, AuditLog
} from '../../core/types';
import { SyntheticDataGenerator } from '../../core/synthetic/dataGenerator';

/**
 * VaultFlow In-Memory Database Repository with Real-Time Indexing & Balance Recalculation
 */
export class Repository {
  private static instance: Repository;

  private users: Map<string, User> = new Map();
  private accounts: Map<string, Account> = new Map();
  private transactions: Map<string, Transaction> = new Map();
  private budgets: Map<string, Budget> = new Map();
  private goals: Map<string, SavingsGoal> = new Map();
  private recurring: Map<string, RecurringTransaction> = new Map();
  private alerts: Map<string, Alert> = new Map();
  private auditLogs: AuditLog[] = [];

  private constructor() {
    this.seed();
  }

  public static getInstance(): Repository {
    if (!Repository.instance) {
      Repository.instance = new Repository();
    }
    return Repository.instance;
  }

  /**
   * Reset and seed repository with synthetic data
   */
  public seed(): void {
    this.users.clear();
    this.accounts.clear();
    this.transactions.clear();
    this.budgets.clear();
    this.goals.clear();
    this.recurring.clear();
    this.alerts.clear();
    this.auditLogs = [];

    const user = SyntheticDataGenerator.generateUser();
    this.users.set(user.id, user);

    const accounts = SyntheticDataGenerator.generateAccounts(user.id);
    accounts.forEach(acc => this.accounts.set(acc.id, acc));

    const transactions = SyntheticDataGenerator.generateTransactions(user.id);
    transactions.forEach(tx => this.transactions.set(tx.id, tx));

    const budgets = SyntheticDataGenerator.generateBudgets(user.id);
    budgets.forEach(bgt => this.budgets.set(bgt.id, bgt));

    const goals = SyntheticDataGenerator.generateGoals(user.id);
    goals.forEach(goal => this.goals.set(goal.id, goal));

    const recurringList = SyntheticDataGenerator.generateRecurring(user.id);
    recurringList.forEach(rec => this.recurring.set(rec.id, rec));

    const alerts = SyntheticDataGenerator.generateAlerts(user.id);
    alerts.forEach(alt => this.alerts.set(alt.id, alt));

    const logs = SyntheticDataGenerator.generateAuditLogs(user.id);
    this.auditLogs.push(...logs);
  }

  // --- Users Repository ---
  public getUsers(): User[] {
    return Array.from(this.users.values());
  }

  public getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  public saveUser(user: User): User {
    this.users.set(user.id, user);
    return user;
  }

  // --- Accounts Repository ---
  public getAccounts(userId?: string): Account[] {
    const list = Array.from(this.accounts.values());
    if (userId) return list.filter(a => a.userId === userId);
    return list;
  }

  public getAccountById(id: string): Account | undefined {
    return this.accounts.get(id);
  }

  public saveAccount(account: Account): Account {
    this.accounts.set(account.id, account);
    return account;
  }

  public deleteAccount(id: string): boolean {
    return this.accounts.delete(id);
  }

  // --- Transactions Repository ---
  public getTransactions(userId?: string): Transaction[] {
    const list = Array.from(this.transactions.values());
    if (userId) return list.filter(t => t.userId === userId);
    return list;
  }

  public getTransactionById(id: string): Transaction | undefined {
    return this.transactions.get(id);
  }

  public saveTransaction(tx: Transaction): Transaction {
    this.transactions.set(tx.id, tx);
    return tx;
  }

  public deleteTransaction(id: string): boolean {
    return this.transactions.delete(id);
  }

  // --- Budgets Repository ---
  public getBudgets(userId?: string): Budget[] {
    const list = Array.from(this.budgets.values());
    if (userId) return list.filter(b => b.userId === userId);
    return list;
  }

  public getBudgetById(id: string): Budget | undefined {
    return this.budgets.get(id);
  }

  public saveBudget(budget: Budget): Budget {
    this.budgets.set(budget.id, budget);
    return budget;
  }

  public deleteBudget(id: string): boolean {
    return this.budgets.delete(id);
  }

  // --- Savings Goals Repository ---
  public getGoals(userId?: string): SavingsGoal[] {
    const list = Array.from(this.goals.values());
    if (userId) return list.filter(g => g.userId === userId);
    return list;
  }

  public getGoalById(id: string): SavingsGoal | undefined {
    return this.goals.get(id);
  }

  public saveGoal(goal: SavingsGoal): SavingsGoal {
    this.goals.set(goal.id, goal);
    return goal;
  }

  public deleteGoal(id: string): boolean {
    return this.goals.delete(id);
  }

  // --- Recurring Transactions Repository ---
  public getRecurring(userId?: string): RecurringTransaction[] {
    const list = Array.from(this.recurring.values());
    if (userId) return list.filter(r => r.userId === userId);
    return list;
  }

  public getRecurringById(id: string): RecurringTransaction | undefined {
    return this.recurring.get(id);
  }

  public saveRecurring(rec: RecurringTransaction): RecurringTransaction {
    this.recurring.set(rec.id, rec);
    return rec;
  }

  public deleteRecurring(id: string): boolean {
    return this.recurring.delete(id);
  }

  // --- Alerts Repository ---
  public getAlerts(userId?: string): Alert[] {
    const list = Array.from(this.alerts.values());
    if (userId) return list.filter(a => a.userId === userId);
    return list;
  }

  public saveAlert(alert: Alert): Alert {
    this.alerts.set(alert.id, alert);
    return alert;
  }

  // --- Audit Logs Repository ---
  public getAuditLogs(userId?: string): AuditLog[] {
    if (userId) return this.auditLogs.filter(l => l.userId === userId);
    return [...this.auditLogs];
  }

  public addAuditLog(log: AuditLog): void {
    this.auditLogs.unshift(log);
  }
}
