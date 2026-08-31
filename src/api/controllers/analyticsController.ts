import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AnalyticsService } from '../../domain/analytics/analyticsService';

export class AnalyticsController {
  private service = new AnalyticsService();

  public getCashFlow = (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const monthsBack = req.query.months ? Number(req.query.months) : 6;
      const data = this.service.getCashFlowSummary(userId, monthsBack);
      res.json({ success: true, data, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };

  public getCategoryBreakdown = (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      const data = this.service.getSpendingCategoryBreakdown(userId, startDate, endDate);
      res.json({ success: true, data, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };

  public getMonteCarlo = (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const years = req.query.years ? Number(req.query.years) : 20;
      const data = this.service.runMonteCarloWealthSimulation(userId, years);
      res.json({ success: true, data, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };
}
