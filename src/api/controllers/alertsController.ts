import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AlertService } from '../../domain/alerts/alertService';

export class AlertsController {
  private service = new AlertService();

  public getAlerts = (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const alerts = this.service.getAlerts(userId);
      res.json({ success: true, data: alerts, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };

  public markRead = (req: AuthenticatedRequest, res: Response) => {
    try {
      const success = this.service.markAsRead(req.params.id);
      res.json({ success, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };

  public evaluate = (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const alerts = this.service.evaluateAlerts(userId);
      res.json({ success: true, data: alerts, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };
}
