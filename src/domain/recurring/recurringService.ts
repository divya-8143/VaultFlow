import { v4 as uuidv4 } from 'uuid';
import { RecurringTransaction, TransactionType, TransactionCategory, RecurringFrequency } from '../../core/types';
import { Repository } from '../../infrastructure/database/repository';
import { TransactionService } from '../transactions/transactionService';
import { DateUtils } from '../../core/utils/date';
import { FinancialMath } from '../../core/utils/math';

export class RecurringService {
  private repo = Repository.getInstance();
  private transactionService = new TransactionService();

  public getRecurring(userId: string): RecurringTransaction[] {
    return this.repo.getRecurring(userId);
  }

  public createRecurring(userId: string, data: Omit<RecurringTransaction, 'id' | 'userId' | 'isActive' | 'createdAt' | 'updatedAt'>): RecurringTransaction {
    const recurring: RecurringTransaction = {
      id: uuidv4(),
      userId,
      accountId: data.accountId,
      merchantName: data.merchantName,
      amount: FinancialMath.round2(data.amount),
      type: data.type,
      category: data.category,
      frequency: data.frequency,
      startDate: new Date(data.startDate),
      nextDueDate: new Date(data.nextDueDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      autoProcess: data.autoProcess ?? true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return this.repo.saveRecurring(recurring);
  }

  /**
   * Process Due Recurring Transactions Batch
   */
  public processDueRecurring(): { processedCount: number; generatedTransactions: string[] } {
    const allRecurring = this.repo.getRecurring().filter(r => r.isActive && r.autoProcess);
    const now = new Date();
    const generatedIds: string[] = [];

    allRecurring.forEach(rec => {
      if (new Date(rec.nextDueDate) <= now) {
        // Execute transaction
        const tx = this.transactionService.createTransaction(rec.userId, {
          accountId: rec.accountId,
          type: rec.type,
          category: rec.category,
          amount: rec.amount,
          merchantName: rec.merchantName,
          description: `Automated Recurring Payment - ${rec.merchantName}`,
          tags: ['recurring', 'auto-payment']
        });

        generatedIds.push(tx.id);

        // Update next due date
        rec.nextDueDate = DateUtils.getNextRecurringDate(new Date(rec.nextDueDate), rec.frequency);
        rec.updatedAt = new Date();
        this.repo.saveRecurring(rec);
      }
    });

    return {
      processedCount: generatedIds.length,
      generatedTransactions: generatedIds
    };
  }
}
