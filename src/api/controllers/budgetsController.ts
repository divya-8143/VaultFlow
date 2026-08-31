import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { BudgetService } from '../../domain/budgets/budgetService';
import { CreateBudgetSchema } from '../../core/schemas';

export class BudgetsController {
  private service = new BudgetService();

  public getBudgets = (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const list = this.service.getBudgets(userId);
      res.json({ success: true, data: list, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };

  public create = (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const validated = CreateBudgetSchema.parse(req.body);
      const budget = this.service.createBudget(userId, {
        ...validated,
        startDate: new Date(validated.startDate),
        endDate: new Date(validated.endDate)
      });
      res.status(201).json({ success: true, data: budget, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };

  public getVariance = (req: AuthenticatedRequest, res: Response) => {
    try {
      const variance = this.service.getBudgetVariance(req.params.id);
      res.json({ success: true, data: variance, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };
}
