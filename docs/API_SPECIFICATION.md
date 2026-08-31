# VaultFlow REST API Specification

All endpoints respond with standardized JSON payload structure:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "timestamp": "2026-08-31T21:47:10.000Z"
}
```

---

## 1. Accounts API (`/api/v1/accounts`)

- `GET /api/v1/accounts`: Retrieve all active user accounts with real-time balance calculations.
- `GET /api/v1/accounts/:id`: Get account detail by ID including recent transaction history.
- `POST /api/v1/accounts`: Create a new bank account (checking, savings, credit, investment, loan).
- `PUT /api/v1/accounts/:id`: Update account metadata (name, institution, limit, APY/APR).
- `DELETE /api/v1/accounts/:id`: Archive account and adjust net worth calculations.
- `GET /api/v1/accounts/summary/net-worth`: Get aggregated net worth across liquid, asset, and liability accounts.

---

## 2. Transactions API (`/api/v1/transactions`)

- `GET /api/v1/transactions`: Query transactions with filters (`accountId`, `startDate`, `endDate`, `category`, `type`, `search`, `limit`, `offset`).
- `POST /api/v1/transactions`: Log new transaction (income, expense, transfer).
- `POST /api/v1/transactions/categorize`: Auto-categorize raw transaction merchant text.
- `POST /api/v1/transactions/split`: Split a single transaction into multiple sub-categories.
- `PUT /api/v1/transactions/:id`: Update transaction details.
- `DELETE /api/v1/transactions/:id`: Revert transaction from account balance.

---

## 3. Budgets API (`/api/v1/budgets`)

- `GET /api/v1/budgets`: List active budgets and spending progress.
- `POST /api/v1/budgets`: Create envelope budget for category/period.
- `GET /api/v1/budgets/performance`: Get budget variance report and category over-spending.
- `PUT /api/v1/budgets/:id`: Adjust budget cap.

---

## 4. Savings Goals API (`/api/v1/goals`)

- `GET /api/v1/goals`: List savings goals.
- `POST /api/v1/goals`: Create goal with target date and target amount.
- `POST /api/v1/goals/:id/deposit`: Deposit money into savings goal.

---

## 5. Recurring Transactions API (`/api/v1/recurring`)

- `GET /api/v1/recurring`: List subscriptions and recurring income/bills.
- `POST /api/v1/recurring`: Add recurring schedule.
- `POST /api/v1/recurring/process`: Trigger due recurring transactions batch execution.

---

## 6. Financial Analytics API (`/api/v1/analytics`)

- `GET /api/v1/analytics/cashflow`: Get monthly income vs expense cash flow trend.
- `GET /api/v1/analytics/velocity`: Get spending velocity and burn rate analysis.
- `GET /api/v1/analytics/projections`: Get 12-month net worth projection.
- `GET /api/v1/analytics/monte-carlo`: Run Monte Carlo simulation for long-term wealth targets.

---

## 7. Reports API (`/api/v1/reports`)

- `GET /api/v1/reports/summary`: Generate executive monthly financial summary report.
- `GET /api/v1/reports/tax-deductions`: Aggregate tax-deductible expense log.
- `GET /api/v1/reports/export`: Export dataset as CSV/JSON payload.

---

## 8. Alerts API (`/api/v1/alerts`)

- `GET /api/v1/alerts`: Get system and financial alerts.
- `POST /api/v1/alerts/:id/read`: Mark alert as read.
- `POST /api/v1/alerts/evaluate`: Manually trigger system alert evaluation engine.

---

## 9. Admin API (`/api/v1/admin`)

- `GET /api/v1/admin/users`: List registered platform users.
- `GET /api/v1/admin/audit-logs`: Query system security and data audit log stream.
- `POST /api/v1/admin/seed`: Trigger synthetic data generator seed reload.
