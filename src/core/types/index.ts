/**
 * Core Data Models & TypeScript Interfaces for VaultFlow FinTech Platform
 */

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
  AUDITOR = 'AUDITOR'
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  baseCurrency: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  emailAlerts: boolean;
  pushAlerts: boolean;
  budgetBreachNotificationThreshold: number; // Percentage, e.g., 85%
  monthlySummaryReport: boolean;
  dateFormat: string;
}

export enum AccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  CREDIT_CARD = 'CREDIT_CARD',
  INVESTMENT = 'INVESTMENT',
  LOAN = 'LOAN',
  MORTGAGE = 'MORTGAGE',
  CRYPTO = 'CRYPTO',
  CASH = 'CASH'
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  institutionName: string;
  type: AccountType;
  accountNumberMasked: string;
  balance: number;
  currency: string;
  apyAprPercentage?: number;
  creditLimit?: number;
  minimumBalance?: number;
  isFavorite: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER'
}

export enum TransactionCategory {
  SALARY = 'Salary & Wages',
  INVESTMENT_INCOME = 'Investment Income',
  FREELANCE = 'Freelance & Side Hustle',
  OTHER_INCOME = 'Other Income',
  
  HOUSING = 'Housing & Rent',
  UTILITIES = 'Utilities & Bills',
  GROCERIES = 'Groceries & Supermarket',
  DINING = 'Dining & Restaurants',
  TRANSPORTATION = 'Transportation & Gas',
  ENTERTAINMENT = 'Entertainment & Streaming',
  SHOPPING = 'Shopping & Apparel',
  HEALTHCARE = 'Healthcare & Medical',
  EDUCATION = 'Education & Learning',
  TRAVEL = 'Travel & Vacation',
  PERSONAL_CARE = 'Personal Care',
  SUBSCRIPTIONS = 'Subscriptions & Services',
  DEBT_REPAYMENT = 'Debt & Loan Repayment',
  SAVINGS_TRANSFER = 'Savings & Investment Transfer',
  MISCELLANEOUS = 'Miscellaneous'
}

export interface SplitTransaction {
  id: string;
  category: TransactionCategory;
  amount: number;
  note?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  targetAccountId?: string; // For transfers
  type: TransactionType;
  category: TransactionCategory;
  subcategory?: string;
  amount: number;
  currency: string;
  date: Date;
  merchantName: string;
  description: string;
  tags: string[];
  splits?: SplitTransaction[];
  isRecurring: boolean;
  recurringId?: string;
  receiptUrl?: string;
  status: 'PENDING' | 'CLEARED' | 'RECONCILED' | 'VOID';
  createdAt: Date;
  updatedAt: Date;
}

export enum BudgetPeriod {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUAL = 'ANNUAL'
}

export interface Budget {
  id: string;
  userId: string;
  name: string;
  category: TransactionCategory;
  limitAmount: number;
  currentSpent: number;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
  alertThresholdPercentage: number;
  isStrictEnvelope: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  category: string;
  monthlyContributionTarget: number;
  isAutoDepositEnabled: boolean;
  linkedAccountId?: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum RecurringFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY'
}

export interface RecurringTransaction {
  id: string;
  userId: string;
  accountId: string;
  merchantName: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  frequency: RecurringFrequency;
  startDate: Date;
  nextDueDate: Date;
  endDate?: Date;
  autoProcess: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum AlertPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum AlertCategory {
  BUDGET_EXCEEDED = 'BUDGET_EXCEEDED',
  BUDGET_WARNING = 'BUDGET_WARNING',
  LOW_BALANCE = 'LOW_BALANCE',
  LARGE_TRANSACTION = 'LARGE_TRANSACTION',
  RECURRING_BILL_DUE = 'RECURRING_BILL_DUE',
  SAVINGS_MILESTONE = 'SAVINGS_MILESTONE',
  SYSTEM_SECURITY = 'SYSTEM_SECURITY'
}

export interface Alert {
  id: string;
  userId: string;
  category: AlertCategory;
  priority: AlertPriority;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  details?: Record<string, any>;
}

export interface NetWorthPoint {
  date: string;
  assets: number;
  liabilities: number;
  netWorth: number;
}

export interface CashFlowSummary {
  period: string;
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRatePercentage: number;
}

export interface SpendingCategoryBreakdown {
  category: TransactionCategory;
  totalSpent: number;
  percentageOfTotal: number;
  transactionCount: number;
  averageTransactionAmount: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  meta?: Record<string, any>;
}
