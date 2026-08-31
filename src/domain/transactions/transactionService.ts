import { v4 as uuidv4 } from 'uuid';
import { Transaction, TransactionType, TransactionCategory, SplitTransaction } from '../../core/types';
import { Repository } from '../../infrastructure/database/repository';
import { AccountService } from '../accounts/accountService';
import { CATEGORY_KEYWORDS } from '../../core/constants';
import { FinancialMath } from '../../core/utils/math';

export class TransactionService {
  private repo = Repository.getInstance();
  private accountService = new AccountService();

  public getTransactions(
    userId: string,
    filters?: {
      accountId?: string;
      startDate?: Date;
      endDate?: Date;
      category?: TransactionCategory;
      type?: TransactionType;
      search?: string;
      limit?: number;
      offset?: number;
    }
  ): { items: Transaction[]; total: number } {
    let list = this.repo.getTransactions(userId);

    if (filters) {
      if (filters.accountId) list = list.filter(t => t.accountId === filters.accountId);
      if (filters.category) list = list.filter(t => t.category === filters.category);
      if (filters.type) list = list.filter(t => t.type === filters.type);
      if (filters.startDate) list = list.filter(t => new Date(t.date) >= filters.startDate!);
      if (filters.endDate) list = list.filter(t => new Date(t.date) <= filters.endDate!);
      if (filters.search) {
        const query = filters.search.toLowerCase();
        list = list.filter(t => t.merchantName.toLowerCase().includes(query) || t.description.toLowerCase().includes(query));
      }
    }

    const total = list.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 50;
    const items = list.slice(offset, offset + limit);

    return { items, total };
  }

  public createTransaction(
    userId: string,
    data: {
      accountId: string;
      targetAccountId?: string;
      type: TransactionType;
      category?: TransactionCategory;
      amount: number;
      currency?: string;
      date?: Date;
      merchantName: string;
      description?: string;
      tags?: string[];
      splits?: SplitTransaction[];
    }
  ): Transaction {
    const account = this.accountService.getAccountById(data.accountId, userId);
    if (!account) throw new Error(`Account ${data.accountId} not found`);

    const category = data.category || this.autoCategorize(data.merchantName, data.description || '');
    const txDate = data.date || new Date();
    const amount = FinancialMath.round2(data.amount);

    const transaction: Transaction = {
      id: uuidv4(),
      userId,
      accountId: data.accountId,
      targetAccountId: data.targetAccountId,
      type: data.type,
      category,
      amount,
      currency: data.currency || account.currency || 'USD',
      date: txDate,
      merchantName: data.merchantName,
      description: data.description || `Transaction at ${data.merchantName}`,
      tags: data.tags || [],
      splits: data.splits,
      isRecurring: false,
      status: 'CLEARED',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Update account balances
    if (data.type === TransactionType.EXPENSE) {
      this.accountService.updateBalance(data.accountId, -amount);
    } else if (data.type === TransactionType.INCOME) {
      this.accountService.updateBalance(data.accountId, amount);
    } else if (data.type === TransactionType.TRANSFER && data.targetAccountId) {
      this.accountService.updateBalance(data.accountId, -amount);
      this.accountService.updateBalance(data.targetAccountId, amount);
    }

    return this.repo.saveTransaction(transaction);
  }

  /**
   * Rule-Based and Fuzzy Keyword Categorization Engine
   */
  public autoCategorize(merchantName: string, description: string = ''): TransactionCategory {
    const text = `${merchantName} ${description}`.toLowerCase();

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          return category as TransactionCategory;
        }
      }
    }

    return TransactionCategory.MISCELLANEOUS;
  }
}
