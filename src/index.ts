import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import apiRouter from './api/routes';
import { Repository } from './infrastructure/database/repository';
import { Logger } from './infrastructure/logger/logger';
import { DashboardApp } from './web/dashboardApp';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// Initialize Repository Seed
const repo = Repository.getInstance();
Logger.info(`VaultFlow FinTech Platform initialized with synthetic data seeder`);

// API Routing
app.use('/api/v1', apiRouter);

// Interactive Web Dashboard Route
const dashboardApp = new DashboardApp();
app.get('/', (req, res) => {
  const users = repo.getUsers();
  const primaryUserId = users.length > 0 ? users[0].id : '';
  const html = dashboardApp.renderDashboardHTML(primaryUserId);
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Start Server if launched directly
if (require.main === module) {
  app.listen(PORT, () => {
    Logger.info(`🚀 VaultFlow FinTech Server running at http://localhost:${PORT}`);
  });
}

export default app;
