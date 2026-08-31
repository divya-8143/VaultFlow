import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { GoalService } from '../../domain/goals/goalService';
import { CreateSavingsGoalSchema } from '../../core/schemas';

export class GoalsController {
  private service = new GoalService();

  public getGoals = (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const goals = this.service.getGoals(userId);
      res.json({ success: true, data: goals, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };

  public create = (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const validated = CreateSavingsGoalSchema.parse(req.body);
      const goal = this.service.createGoal(userId, {
        ...validated,
        targetDate: new Date(validated.targetDate)
      });
      res.status(201).json({ success: true, data: goal, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };

  public deposit = (req: AuthenticatedRequest, res: Response) => {
    try {
      const { amount, sourceAccountId } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, error: 'Positive deposit amount required', timestamp: new Date().toISOString() });
      }
      const goal = this.service.depositIntoGoal(req.params.id, amount, sourceAccountId);
      res.json({ success: true, data: goal, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };
}
