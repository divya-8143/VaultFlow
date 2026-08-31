import { TransactionService } from '../src/domain/transactions/transactionService';
import { TransactionType, TransactionCategory } from '../src/core/types';
import { Repository } from '../src/infrastructure/database/repository';

describe('TransactionService & Categorizer Test Suite', () => {
  let service: TransactionService;
  let repo: Repository;
  const testUserId = 'u1111111-1111-4111-a111-111111111111';

  beforeEach(() => {
    repo = Repository.getInstance();
    repo.seed();
    service = new TransactionService();
  });

  test('Test Case 6: Should query and filter transactions by account and type', () => {
    const result = service.getTransactions(testUserId, { type: TransactionType.EXPENSE, limit: 10 });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.every(t => t.type === TransactionType.EXPENSE)).toBe(true);
  });

  test('Test Case 7: Should log expense transaction and deduct balance from account', () => {
    const account = repo.getAccounts(testUserId)[0];
    const initialBalance = account.balance;

    const tx = service.createTransaction(testUserId, {
      accountId: account.id,
      type: TransactionType.EXPENSE,
      category: TransactionCategory.GROCERIES,
      amount: 85.40,
      merchantName: 'Trader Joe\'s',
      description: 'Weekly grocery run'
    });

    expect(tx.id).toBeDefined();
    expect(tx.amount).toBe(85.40);
    const updatedAccount = repo.getAccountById(account.id)!;
    expect(updatedAccount.balance).toBe(initialBalance - 85.40);
  });

  test('Test Case 8: Auto-categorizer rule engine should classify merchant keywords correctly', () => {
    expect(service.autoCategorize('Starbucks Coffee #4412')).toBe(TransactionCategory.DINING);
    expect(service.autoCategorize('Chevron Oil & Gas')).toBe(TransactionCategory.TRANSPORTATION);
    expect(service.autoCategorize('Acme Corp Payroll')).toBe(TransactionCategory.SALARY);
    expect(service.autoCategorize('Netflix Streaming Subscription')).toBe(TransactionCategory.ENTERTAINMENT);
    expect(service.autoCategorize('Unknown Mystery Store')).toBe(TransactionCategory.MISCELLANEOUS);
  });
});
