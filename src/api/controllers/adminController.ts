import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AdminService } from '../../domain/admin/adminService';

export class AdminController {
  private service = new AdminService();

  public getUsers = (req: AuthenticatedRequest, res: Response) => {
    try {
      const users = this.service.getUsers(req.user!);
      res.json({ success: true, data: users, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(403).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };

  public getAuditLogs = (req: AuthenticatedRequest, res: Response) => {
    try {
      const logs = this.service.getAuditLogs(req.user!);
      res.json({ success: true, data: logs, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(403).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };

  public resetSyntheticData = (req: AuthenticatedRequest, res: Response) => {
    try {
      const result = this.service.resetSyntheticData(req.user!);
      res.json({ success: true, data: result, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(403).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };
}
