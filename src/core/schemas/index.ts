import { z } from 'zod';
import { AccountType, TransactionType, TransactionCategory, BudgetPeriod, RecurringFrequency, AlertPriority, UserRole } from '../types';

export const UserRegistrationSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2).max(100),
  baseCurrency: z.string().length(3).default('USD'),
  role: z.nativeEnum(UserRole).default(UserRole.USER)
});

export const CreateAccountSchema = z.object({
  name: z.string().min(2).max(60),
  institutionName: z.string().min(2).max(60),
  type: z.nativeEnum(AccountType),
  balance: z.number(),
  currency: z.string().length(3).default('USD'),
  apyAprPercentage: z.number().min(0).max(100).optional(),
  creditLimit: z.number().min(0).optional(),
  minimumBalance: z.number().min(0).optional()
});

export const CreateTransactionSchema = z.object({
  accountId: z.string().uuid(),
  targetAccountId: z.string().uuid().optional(),
  type: z.nativeEnum(TransactionType),
  category: z.nativeEnum(TransactionCategory),
  subcategory: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  date: z.string().or(z.date()),
  merchantName: z.string().min(1),
  description: z.string().default(''),
  tags: z.array(z.string()).default([]),
  status: z.enum(['PENDING', 'CLEARED', 'RECONCILED', 'VOID']).default('CLEARED')
});

export const CreateBudgetSchema = z.object({
  name: z.string().min(2),
  category: z.nativeEnum(TransactionCategory),
  limitAmount: z.number().positive(),
  period: z.nativeEnum(BudgetPeriod).default(BudgetPeriod.MONTHLY),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  alertThresholdPercentage: z.number().min(1).max(100).default(85),
  isStrictEnvelope: z.boolean().default(false)
});

export const CreateSavingsGoalSchema = z.object({
  name: z.string().min(2),
  targetAmount: z.number().positive(),
  currentAmount: z.number().min(0).default(0),
  targetDate: z.string().or(z.date()),
  category: z.string().default('General Savings'),
  monthlyContributionTarget: z.number().min(0).default(0),
  isAutoDepositEnabled: z.boolean().default(false),
  linkedAccountId: z.string().uuid().optional()
});

export const CreateRecurringSchema = z.object({
  accountId: z.string().uuid(),
  merchantName: z.string().min(1),
  amount: z.number().positive(),
  type: z.nativeEnum(TransactionType),
  category: z.nativeEnum(TransactionCategory),
  frequency: z.nativeEnum(RecurringFrequency),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
  autoProcess: z.boolean().default(true)
});

export const FilterTransactionQuerySchema = z.object({
  accountId: z.string().uuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  category: z.nativeEnum(TransactionCategory).optional(),
  type: z.nativeEnum(TransactionType).optional(),
  merchantName: z.string().optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  search: z.string().optional(),
  limit: z.number().min(1).max(500).default(50),
  offset: z.number().min(0).default(0)
});
