import { v4 as uuidv4 } from 'uuid';
import { Budget, BudgetPeriod, TransactionCategory, TransactionType } from '../../core/types';
import { Repository } from '../../infrastructure/database/repository';
import { FinancialMath } from '../../core/utils/math';

export class BudgetService {
  private repo = Repository.getInstance();

  public getBudgets(userId: string): Budget[] {
    const budgets = this.repo.getBudgets(userId);
    // Recalculate spent amounts for active budgets based on transactions
    budgets.forEach(budget => this.recalculateBudgetSpent(budget.id));
    return this.repo.getBudgets(userId);
  }

  public createBudget(userId: string, data: Omit<Budget, 'id' | 'userId' | 'currentSpent' | 'createdAt' | 'updatedAt'>): Budget {
    const budget: Budget = {
      id: uuidv4(),
      userId,
      name: data.name,
      category: data.category,
      limitAmount: FinancialMath.round2(data.limitAmount),
      currentSpent: 0,
      period: data.period || BudgetPeriod.MONTHLY,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      alertThresholdPercentage: data.alertThresholdPercentage || 85,
      isStrictEnvelope: data.isStrictEnvelope || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const saved = this.repo.saveBudget(budget);
    this.recalculateBudgetSpent(saved.id);
    return this.repo.getBudgetById(saved.id)!;
  }

  public recalculateBudgetSpent(budgetId: string): number {
    const budget = this.repo.getBudgetById(budgetId);
    if (!budget) return 0;

    const transactions = this.repo.getTransactions(budget.userId).filter(t => {
      const tDate = new Date(t.date);
      return (
        t.category === budget.category &&
        t.type === TransactionType.EXPENSE &&
        tDate >= new Date(budget.startDate) &&
        tDate <= new Date(budget.endDate)
      );
    });

    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    budget.currentSpent = FinancialMath.round2(totalSpent);
    budget.updatedAt = new Date();
    this.repo.saveBudget(budget);

    return budget.currentSpent;
  }

  public getBudgetVariance(budgetId: string) {
    const budget = this.repo.getBudgetById(budgetId);
    if (!budget) throw new Error(`Budget ${budgetId} not found`);

    this.recalculateBudgetSpent(budgetId);
    return FinancialMath.calculateVariance(budget.currentSpent, budget.limitAmount);
  }
}

// Zero-Based Envelope Budget Validator
export function validateZeroBasedBudget(income: number, totalAllocated: number): boolean {
  return Math.abs(income - totalAllocated) < 0.01;
}
