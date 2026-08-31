import { v4 as uuidv4 } from 'uuid';
import { SavingsGoal } from '../../core/types';
import { Repository } from '../../infrastructure/database/repository';
import { FinancialMath } from '../../core/utils/math';
import { AccountService } from '../accounts/accountService';

export class GoalService {
  private repo = Repository.getInstance();
  private accountService = new AccountService();

  public getGoals(userId: string): SavingsGoal[] {
    return this.repo.getGoals(userId);
  }

  public createGoal(userId: string, data: Omit<SavingsGoal, 'id' | 'userId' | 'isCompleted' | 'createdAt' | 'updatedAt'>): SavingsGoal {
    const goal: SavingsGoal = {
      id: uuidv4(),
      userId,
      name: data.name,
      targetAmount: FinancialMath.round2(data.targetAmount),
      currentAmount: FinancialMath.round2(data.currentAmount || 0),
      targetDate: new Date(data.targetDate),
      category: data.category || 'General Savings',
      monthlyContributionTarget: FinancialMath.round2(data.monthlyContributionTarget || 0),
      isAutoDepositEnabled: data.isAutoDepositEnabled || false,
      linkedAccountId: data.linkedAccountId,
      isCompleted: (data.currentAmount || 0) >= data.targetAmount,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return this.repo.saveGoal(goal);
  }

  public depositIntoGoal(goalId: string, amount: number, sourceAccountId?: string): SavingsGoal {
    const goal = this.repo.getGoalById(goalId);
    if (!goal) throw new Error(`Savings Goal ${goalId} not found`);

    if (sourceAccountId) {
      this.accountService.updateBalance(sourceAccountId, -amount);
    }

    goal.currentAmount = FinancialMath.round2(goal.currentAmount + amount);
    if (goal.currentAmount >= goal.targetAmount) {
      goal.isCompleted = true;
    }
    goal.updatedAt = new Date();

    return this.repo.saveGoal(goal);
  }

  public calculateMonthlyRequirement(goalId: string): { monthsRemaining: number; requiredMonthlyDeposit: number } {
    const goal = this.repo.getGoalById(goalId);
    if (!goal) throw new Error(`Savings Goal ${goalId} not found`);

    const now = new Date();
    const targetDate = new Date(goal.targetDate);
    const monthsRemaining = Math.max(1, (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth()));
    
    const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);
    const requiredMonthlyDeposit = FinancialMath.round2(remainingAmount / monthsRemaining);

    return { monthsRemaining, requiredMonthlyDeposit };
  }
}
