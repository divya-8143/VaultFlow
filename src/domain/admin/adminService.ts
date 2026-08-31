import { User, AuditLog, UserRole } from '../../core/types';
import { Repository } from '../../infrastructure/database/repository';
import { RBACManager } from '../../infrastructure/security/rbac';

export class AdminService {
  private repo = Repository.getInstance();

  public getUsers(requestingUser: User): User[] {
    if (!RBACManager.hasRole(requestingUser.role, UserRole.MANAGER)) {
      throw new Error('Unauthorized: Manager or Admin access required');
    }
    return this.repo.getUsers();
  }

  public getAuditLogs(requestingUser: User): AuditLog[] {
    if (!RBACManager.hasRole(requestingUser.role, UserRole.AUDITOR)) {
      throw new Error('Unauthorized: Auditor or Admin access required');
    }
    return this.repo.getAuditLogs();
  }

  public resetSyntheticData(requestingUser: User): { message: string; timestamp: string } {
    if (!RBACManager.hasRole(requestingUser.role, UserRole.ADMIN)) {
      throw new Error('Unauthorized: Admin role required for synthetic data reset');
    }

    this.repo.seed();
    this.repo.addAuditLog({
      id: `log-${Date.now()}`,
      userId: requestingUser.id,
      action: 'ADMIN_RESET_SYNTHETIC_DATA',
      resource: 'SYSTEM',
      ipAddress: '127.0.0.1',
      userAgent: 'VaultFlowAdminConsole/1.0',
      timestamp: new Date(),
      details: { status: 'SUCCESS' }
    });

    return {
      message: 'Synthetic financial dataset successfully re-seeded',
      timestamp: new Date().toISOString()
    };
  }
}
