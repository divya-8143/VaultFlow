# VaultFlow – Enterprise Personal Finance & Expense Management Platform

VaultFlow is a high-performance, enterprise-grade Personal Finance and Expense Management platform built with TypeScript. It provides end-to-end capabilities for income tracking, expense classification, multi-account ledger management, envelope budgeting, savings goal milestones, recurring subscription tracking, real-time threshold alert evaluation, financial analytics, Monte Carlo wealth projection, PDF/CSV report generation, and administrative control.

---

## Key Features

- **Multi-Account Ledger System**: Supports Checking, Savings, Credit Cards, Investment Portfolios, Loans, and Fixed Assets with automated interest & fee accrual engines.
- **Transaction Engine & Auto-Categorization**: Intelligent rule-based and fuzzy-matching transaction categorizer supporting split transactions, tags, receipt metadata, and multi-currency exchange conversion.
- **Budgeting & Savings Goals**: Envelope budgeting, zero-based budgeting, variance analysis, and milestone goal projection engines.
- **Recurring Transactions Processor**: Handles automated salary schedules, subscription billing, loan amortization, and upcoming bill reminders.
- **Financial Analytics & Projections**: Cash flow forecasting, spending velocity, liquidity metrics, net worth tracking, and Monte Carlo retirement simulations.
- **Reports Engine**: Executive summaries, monthly P&L statements, tax deduction categorizers, and exportable JSON/CSV audit trails.
- **Alert & Anomaly Detection**: Real-time evaluation of spending breaches, low balance warnings, unusual merchant activity, and recurring bill due alerts.
- **Admin & Audit Logging**: Full RBAC user management, audit trails, system parameters, and synthetic data generator control panel.
- **Synthetic Financial Engine**: High-fidelity synthetic banking data generator creating realistic multi-year user financial histories with zero sensitive/live data requirements.

---

## Directory Structure

```
src/
├── core/            # Types, Schemas, Math Utils, Synthetic Data Generator
├── domain/          # Accounts, Transactions, Budgets, Goals, Recurring, Analytics, Reports, Alerts, Admin
├── infrastructure/  # Repositories, Logger, Security & RBAC
├── api/             # REST Controllers, Middleware, Routes
├── web/             # Web Dashboard Components, State, Views
└── index.ts         # Application Entrypoint

tests/               # Comprehensive Unit & Integration Test Suites
```

---

## Getting Started

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Installation
```bash
npm install
```

### Build & Run
```bash
# Build TypeScript
npm run build

# Start Production Server
npm start

# Run Development Server
npm run dev
```

### Run Tests
```bash
npm test
```

### Seed Synthetic Data
```bash
npm run seed
```

---

## Security & Privacy Notice
All financial data within VaultFlow is generated synthetically for demo and evaluation purposes. No real banking credentials, secrets, API keys, or personally identifiable information (PII) are stored or transmitted.

---

## License
MIT License.
