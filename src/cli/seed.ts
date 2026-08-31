import { Repository } from '../infrastructure/database/repository';
import { Logger } from '../infrastructure/logger/logger';

function runSeed() {
  Logger.info('Starting VaultFlow Synthetic Data Seeding process...');
  const repo = Repository.getInstance();
  repo.seed();
  
  const users = repo.getUsers();
  const accounts = repo.getAccounts();
  const transactions = repo.getTransactions();
  const budgets = repo.getBudgets();
  const goals = repo.getGoals();

  Logger.info('Seeding Completed Successfully!');
  Logger.info(`Summary: ${users.length} Users, ${accounts.length} Accounts, ${transactions.length} Transactions, ${budgets.length} Budgets, ${goals.length} Goals.`);
}

runSeed();
