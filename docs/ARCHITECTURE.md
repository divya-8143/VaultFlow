# VaultFlow System Architecture

## Overview
VaultFlow is designed following clean architectural patterns (Domain-Driven Design), separating entity core models, domain logic services, infrastructure adapters, API controllers, and presentation layers.

```
+-----------------------------------------------------------------------+
|                             Presentation                              |
|   Web UI Dashboards / Charts / Reports Views / Admin Control Console  |
+------------------------------------+----------------------------------+
                                     |
                                     v
+------------------------------------+----------------------------------+
|                            API Controllers                            |
| Accounts API | Transactions API | Budgets API | Analytics | Admin API |
+------------------------------------+----------------------------------+
                                     |
                                     v
+------------------------------------+----------------------------------+
|                         Domain Services Layer                         |
| AccountsEngine | CategorizerEngine | BudgetCalculator | AnalyticsEngine|
+------------------------------------+----------------------------------+
                                     |
                                     v
+------------------------------------+----------------------------------+
|                      Infrastructure & Persistence                     |
| Repositories | Synthetic Data Generator | Audit Logger | Security RBAC|
+-----------------------------------------------------------------------+
```

## Architectural Principles

1. **Separation of Concerns**: Domain logic is pure and decoupled from HTTP routing or presentation UI.
2. **Synthetic Data Independence**: Data generators produce deterministic financial time-series for stress testing and realistic simulations without external APIs.
3. **Immutability & Audit Trail**: All ledger movements record double-entry transaction state changes to preserve total balance integrity.
4. **Resilient Financial Calculations**: Monetary math utilizes fixed precision floating point helpers and BigNumber equivalents to prevent IEEE 754 rounding inaccuracies.
5. **Real-time Alert Engine**: Event-driven notification evaluation triggered on transaction insert, balance recalculation, and budget window evaluation.

---

## Component Boundaries

### Core Domain Models
- `User`: Identity, preferences, currency settings, RBAC role.
- `Account`: Type (checking, savings, credit, investment, loan, asset), balance, APR, credit limit.
- `Transaction`: Id, accountId, amount, type (income, expense, transfer), category, tags, date, merchant.
- `Budget`: Category, period (monthly, quarterly, annual), limit, current spent, alerts threshold.
- `SavingsGoal`: Name, target amount, current amount, target date, monthly contribution target.
- `RecurringTransaction`: Frequency, amount, nextDueDate, autoProcess flag, status.
- `Alert`: Priority, message, category, date, read status.
- `AuditLog`: Action, userId, resource, timestamp, ipAddress, payload metadata.
