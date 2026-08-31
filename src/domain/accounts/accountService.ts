import { v4 as uuidv4 } from 'uuid';
import { Account, AccountType, NetWorthPoint } from '../../core/types';
import { Repository } from '../../infrastructure/database/repository';
import { FinancialMath } from '../../core/utils/math';
import { CurrencyUtils } from '../../core/utils/currency';

export class AccountService {
  private repo = Repository.getInstance();

  public getAllAccounts(userId: string): Account[] {
    return this.repo.getAccounts(userId);
  }

  public getAccountById(accountId: string, userId: string): Account | undefined {
    const acc = this.repo.getAccountById(accountId);
    if (acc && acc.userId === userId) return acc;
    return undefined;
  }

  public createAccount(userId: string, data: Omit<Account, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'isFavorite' | 'isActive' | 'accountNumberMasked'> & { accountNumberMasked?: string }): Account {
    const masked = data.accountNumberMasked || `**** ${Math.floor(1000 + Math.random() * 9000)}`;
    const newAccount: Account = {
      id: uuidv4(),
      userId,
      name: data.name,
      institutionName: data.institutionName,
      type: data.type,
      accountNumberMasked: masked,
      balance: FinancialMath.round2(data.balance),
      currency: data.currency || 'USD',
      apyAprPercentage: data.apyAprPercentage,
      creditLimit: data.creditLimit,
      minimumBalance: data.minimumBalance,
      isFavorite: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return this.repo.saveAccount(newAccount);
  }

  public updateBalance(accountId: string, amountDelta: number): Account {
    const account = this.repo.getAccountById(accountId);
    if (!account) throw new Error(`Account with ID ${accountId} not found`);

    account.balance = FinancialMath.round2(account.balance + amountDelta);
    account.updatedAt = new Date();
    return this.repo.saveAccount(account);
  }

  public calculateNetWorth(userId: string, targetCurrency: string = 'USD'): NetWorthPoint {
    const accounts = this.getAllAccounts(userId).filter(a => a.isActive);
    let assets = 0;
    let liabilities = 0;

    accounts.forEach(acc => {
      const convertedBalance = CurrencyUtils.convert(acc.balance, acc.currency, targetCurrency);
      if (convertedBalance >= 0) {
        assets += convertedBalance;
      } else {
        liabilities += Math.abs(convertedBalance);
      }
    });

    const netWorth = FinancialMath.round2(assets - liabilities);
    return {
      date: new Date().toISOString().split('T')[0],
      assets: FinancialMath.round2(assets),
      liabilities: FinancialMath.round2(liabilities),
      netWorth
    };
  }

  /**
   * Accrue Monthly Interest for HYSA or Credit Cards
   */
  public accrueMonthlyInterest(accountId: string): { interestAccrued: number; newBalance: number } {
    const account = this.repo.getAccountById(accountId);
    if (!account || !account.apyAprPercentage) return { interestAccrued: 0, newBalance: account?.balance || 0 };

    const monthlyRate = (account.apyAprPercentage / 100) / 12;
    const interestAccrued = FinancialMath.round2(account.balance * monthlyRate);
    account.balance = FinancialMath.round2(account.balance + interestAccrued);
    account.updatedAt = new Date();
    this.repo.saveAccount(account);

    return { interestAccrued, newBalance: account.balance };
  }
}
