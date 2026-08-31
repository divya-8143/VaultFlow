import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { RecurringService } from '../../domain/recurring/recurringService';
import { CreateRecurringSchema } from '../../core/schemas';

export class RecurringController {
  private service = new RecurringService();

  public getRecurring = (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const list = this.service.getRecurring(userId);
      res.json({ success: true, data: list, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };

  public create = (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const validated = CreateRecurringSchema.parse(req.body);
      const recurring = this.service.createRecurring(userId, {
        ...validated,
        startDate: new Date(validated.startDate),
        nextDueDate: new Date(validated.startDate),
        endDate: validated.endDate ? new Date(validated.endDate) : undefined
      });
      res.status(201).json({ success: true, data: recurring, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };

  public processBatch = (req: AuthenticatedRequest, res: Response) => {
    try {
      const result = this.service.processDueRecurring();
      res.json({ success: true, data: result, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };
}
