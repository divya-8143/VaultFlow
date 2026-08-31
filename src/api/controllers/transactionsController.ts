import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { TransactionService } from '../../domain/transactions/transactionService';
import { CreateTransactionSchema, FilterTransactionQuerySchema } from '../../core/schemas';

export class TransactionsController {
  private service = new TransactionService();

  public getTransactions = (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const parsedFilters = FilterTransactionQuerySchema.parse({
        accountId: req.query.accountId,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        category: req.query.category,
        type: req.query.type,
        search: req.query.search,
        limit: req.query.limit ? Number(req.query.limit) : 50,
        offset: req.query.offset ? Number(req.query.offset) : 0
      });

      const filters = {
        ...parsedFilters,
        startDate: parsedFilters.startDate ? new Date(parsedFilters.startDate) : undefined,
        endDate: parsedFilters.endDate ? new Date(parsedFilters.endDate) : undefined
      };

      const result = this.service.getTransactions(userId, filters);
      res.json({ success: true, data: result.items, meta: { total: result.total }, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };

  public create = (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const validated = CreateTransactionSchema.parse(req.body);
      const tx = this.service.createTransaction(userId, {
        ...validated,
        date: new Date(validated.date)
      });
      res.status(201).json({ success: true, data: tx, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };

  public categorize = (req: AuthenticatedRequest, res: Response) => {
    try {
      const { merchantName, description } = req.body;
      if (!merchantName) {
        return res.status(400).json({ success: false, error: 'merchantName is required', timestamp: new Date().toISOString() });
      }
      const category = this.service.autoCategorize(merchantName, description || '');
      res.json({ success: true, data: { merchantName, category }, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };
}
