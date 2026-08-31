import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AccountService } from '../../domain/accounts/accountService';
import { CreateAccountSchema } from '../../core/schemas';

export class AccountsController {
  private service = new AccountService();

  public getAll = (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const accounts = this.service.getAllAccounts(userId);
      res.json({ success: true, data: accounts, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };

  public getById = (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const account = this.service.getAccountById(req.params.id, userId);
      if (!account) {
        return res.status(404).json({ success: false, error: 'Account not found', timestamp: new Date().toISOString() });
      }
      res.json({ success: true, data: account, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };

  public create = (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const validated = CreateAccountSchema.parse(req.body);
      const newAcc = this.service.createAccount(userId, validated);
      res.status(201).json({ success: true, data: newAcc, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };

  public getNetWorth = (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const currency = (req.query.currency as string) || req.user?.baseCurrency || 'USD';
      const netWorth = this.service.calculateNetWorth(userId, currency);
      res.json({ success: true, data: netWorth, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
    }
  };
}
