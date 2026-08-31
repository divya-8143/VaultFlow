import { Request, Response, NextFunction } from 'express';
import { Repository } from '../../infrastructure/database/repository';
import { User } from '../../core/types';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const repo = Repository.getInstance();
  const users = repo.getUsers();
  
  // Default to primary demo user
  if (users.length > 0) {
    req.user = users[0];
  }

  next();
}
