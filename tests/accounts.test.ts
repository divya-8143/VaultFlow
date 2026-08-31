import { AccountService } from '../src/domain/accounts/accountService';
import { AccountType } from '../src/core/types';
import { Repository } from '../src/infrastructure/database/repository';

describe('AccountService Test Suite', () => {
  let service: AccountService;
  let repo: Repository;
  const testUserId = 'u1111111-1111-4111-a111-111111111111';

  beforeEach(() => {
    repo = Repository.getInstance();
    repo.seed();
    service = new AccountService();
  });

  test('Test Case 1: Should retrieve seeded accounts for user', () => {
    const accounts = service.getAllAccounts(testUserId);
    expect(accounts.length).toBeGreaterThan(0);
    expect(accounts.some(a => a.type === AccountType.CHECKING)).toBe(true);
    expect(accounts.some(a => a.type === AccountType.SAVINGS)).toBe(true);
  });

  test('Test Case 2: Should create a new bank account with masked number', () => {
    const newAccount = service.createAccount(testUserId, {
      name: 'Secondary Savings',
      institutionName: 'Apex Capital',
      type: AccountType.SAVINGS,
      accountNumberMasked: '**** 5512',
      balance: 5000.00,
      currency: 'USD',
      apyAprPercentage: 4.5
    });

    expect(newAccount.id).toBeDefined();
    expect(newAccount.balance).toBe(5000.00);
    expect(newAccount.accountNumberMasked).toBe('**** 5512');
  });

  test('Test Case 3: Should accurately update account balance on transaction delta', () => {
    const account = service.getAllAccounts(testUserId)[0];
    const initialBalance = account.balance;
    const updated = service.updateBalance(account.id, -250.50);

    expect(updated.balance).toBe(initialBalance - 250.50);
  });

  test('Test Case 4: Should aggregate net worth across liquid, investment, and debt accounts', () => {
    const netWorth = service.calculateNetWorth(testUserId, 'USD');
    expect(netWorth.assets).toBeGreaterThan(0);
    expect(netWorth.netWorth).toBe(netWorth.assets - netWorth.liabilities);
  });

  test('Test Case 5: Should accrue monthly compound interest accurately', () => {
    const savings = service.getAllAccounts(testUserId).find(a => a.type === AccountType.SAVINGS)!;
    const initialBalance = savings.balance;
    const result = service.accrueMonthlyInterest(savings.id);

    expect(result.interestAccrued).toBeGreaterThan(0);
    expect(result.newBalance).toBe(initialBalance + result.interestAccrued);
  });
});
