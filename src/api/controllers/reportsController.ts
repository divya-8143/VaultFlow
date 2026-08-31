import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { ReportService } from '../../domain/reports/reportService';

export class ReportsController {
  private service = new ReportService();

  public getSummary = (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const summary = this.service.generateExecutiveSummary(userId);
      res.json({ success: true, data: summary, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };

  public exportCSV = (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const csv = this.service.exportTransactionsCSV(userId);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=transactions_export.csv');
      res.send(csv);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };
}
