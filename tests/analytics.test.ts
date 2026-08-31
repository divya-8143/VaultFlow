import { AnalyticsService } from '../src/domain/analytics/analyticsService';
import { AlertService } from '../src/domain/alerts/alertService';
import { AdminService } from '../src/domain/admin/adminService';
import { Repository } from '../src/infrastructure/database/repository';
import { UserRole } from '../src/core/types';

describe('Analytics, Alerts & Admin Control Test Suite', () => {
  let repo: Repository;
  const testUserId = 'u1111111-1111-4111-a111-111111111111';

  beforeEach(() => {
    repo = Repository.getInstance();
    repo.seed();
  });

  test('Test Case 10: Cashflow analytics should calculate monthly savings rate', () => {
    const analytics = new AnalyticsService();
    const cashFlow = analytics.getCashFlowSummary(testUserId, 6);
    expect(cashFlow.length).toBeGreaterThan(0);
    expect(cashFlow[0].netSavings).toBeDefined();
    expect(cashFlow[0].savingsRatePercentage).toBeGreaterThanOrEqual(0);
  });

  test('Test Case 11: Alert engine should evaluate budget thresholds and trigger warnings', () => {
    const alertService = new AlertService();
    const alerts = alertService.evaluateAlerts(testUserId);
    expect(Array.isArray(alerts)).toBe(true);
  });

  test('Test Case 12: Admin RBAC service should restrict unauthorized reset operations', () => {
    const adminService = new AdminService();
    const regularUser = repo.getUserById(testUserId)!;
    expect(() => adminService.resetSyntheticData(regularUser)).toThrow();

    const adminUser = { ...regularUser, role: UserRole.ADMIN };
    const result = adminService.resetSyntheticData(adminUser);
    expect(result.message).toContain('successfully re-seeded');
  });
});
