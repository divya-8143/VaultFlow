import { UserRole, User } from '../../core/types';

export interface SecurityContext {
  user: User;
  token: string;
  ipAddress: string;
}

export class RBACManager {
  private static roleHierarchy: Record<UserRole, number> = {
    [UserRole.ADMIN]: 100,
    [UserRole.MANAGER]: 50,
    [UserRole.AUDITOR]: 30,
    [UserRole.USER]: 10
  };

  /**
   * Evaluate if user has minimum required role capability
   */
  public static hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
    const userLevel = this.roleHierarchy[userRole] || 0;
    const requiredLevel = this.roleHierarchy[requiredRole] || 0;
    return userLevel >= requiredLevel;
  }

  /**
   * Evaluate permission on user resource ownership
   */
  public static canAccessResource(requestingUser: User, resourceOwnerUserId: string): boolean {
    if (requestingUser.role === UserRole.ADMIN) return true;
    return requestingUser.id === resourceOwnerUserId;
  }

  /**
   * Sanitize string payload against injection
   */
  public static sanitizeInput(input: string): string {
    return input.replace(/<[^>]*>?/gm, '').trim();
  }
}
