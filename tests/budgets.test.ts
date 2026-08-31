import { BudgetService } from '../src/domain/budgets/budgetService';
import { TransactionCategory, BudgetPeriod } from '../src/core/types';
import { Repository } from '../src/infrastructure/database/repository';

describe('BudgetService & Variance Engine Test Suite', () => {
  let service: BudgetService;
  let repo: Repository;
  const testUserId = 'u1111111-1111-4111-a111-111111111111';

  beforeEach(() => {
    repo = Repository.getInstance();
    repo.seed();
    service = new BudgetService();
  });

  test('Test Case 9: Should create new envelope budget and compute variance', () => {
    const budget = service.createBudget(testUserId, {
      name: 'Test Dining Budget',
      category: TransactionCategory.DINING,
      limitAmount: 500.00,
      period: BudgetPeriod.MONTHLY,
      startDate: new Date(2026, 7, 1),
      endDate: new Date(2026, 7, 31),
      alertThresholdPercentage: 85,
      isStrictEnvelope: true
    });

    expect(budget.id).toBeDefined();
    expect(budget.limitAmount).toBe(500.00);

    const variance = service.getBudgetVariance(budget.id);
    expect(variance.varianceAmount).toBeDefined();
    expect(variance.isOverBudget).toBe(false);
  });
});
