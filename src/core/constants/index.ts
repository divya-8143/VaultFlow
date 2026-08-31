import { TransactionCategory } from '../types';

export const SYSTEM_DEFAULTS = {
  APP_NAME: 'VaultFlow',
  VERSION: '1.0.0',
  DEFAULT_CURRENCY: 'USD',
  DEFAULT_TIMEZONE: 'UTC',
  MAX_PAGE_SIZE: 500,
  DEFAULT_PAGE_SIZE: 50,
  BUDGET_WARNING_THRESHOLD: 85, // percentage
  LOW_BALANCE_ALERT_THRESHOLD: 250.00, // USD
  LARGE_TRANSACTION_THRESHOLD: 1000.00, // USD
};

export const CATEGORY_KEYWORDS: Record<TransactionCategory, string[]> = {
  [TransactionCategory.SALARY]: ['payroll', 'salary', 'stipend', 'employer', 'direct deposit', 'wages'],
  [TransactionCategory.INVESTMENT_INCOME]: ['dividend', 'interest', 'yield', 'capital gain', 'brokerage credit'],
  [TransactionCategory.FREELANCE]: ['upwork', 'fiverr', 'consulting', 'invoice payment', 'stripe payout'],
  [TransactionCategory.OTHER_INCOME]: ['cash back', 'refund', 'rebate', 'gift deposit'],
  
  [TransactionCategory.HOUSING]: ['rent', 'mortgage', 'lease', 'hoa', 'property tax', 'home insurance'],
  [TransactionCategory.UTILITIES]: ['electric', 'power', 'water', 'gas utility', 'internet', 'comcast', 'verizon', 'trash'],
  [TransactionCategory.GROCERIES]: ['walmart', 'trader joe', 'whole foods', 'safeway', 'kroger', 'aldy', 'costco', 'groceries'],
  [TransactionCategory.DINING]: ['mcdonald', 'starbucks', 'chipotle', 'uber eats', 'doordash', 'subway', 'restaurant', 'cafe', 'bistro'],
  [TransactionCategory.TRANSPORTATION]: ['uber', 'lyft', 'shell', 'chevron', 'exxon', 'subway pass', 'transit', 'parking', 'toll'],
  [TransactionCategory.ENTERTAINMENT]: ['netflix', 'spotify', 'hulu', 'cinema', 'amc', 'steam', 'playstation', 'concert'],
  [TransactionCategory.SHOPPING]: ['amazon', 'target', 'ebay', 'nike', 'zara', 'best buy', 'apple store'],
  [TransactionCategory.HEALTHCARE]: ['pharmacy', 'cvs', 'walgreens', 'doctor', 'hospital', 'dental', 'health insurance', 'co-pay'],
  [TransactionCategory.EDUCATION]: ['udemy', 'coursera', 'tuition', 'books', 'university', 'college'],
  [TransactionCategory.TRAVEL]: ['delta', 'united airlines', 'airbnb', 'hotel', 'booking.com', 'expedia', 'car rental'],
  [TransactionCategory.PERSONAL_CARE]: ['salon', 'barber', 'cosmetics', 'sephora', 'spa', 'fitness', 'gym', 'gym membership'],
  [TransactionCategory.SUBSCRIPTIONS]: ['github', 'chatgpt', 'openai', 'aws', 'cloud storage', 'google one', 'icloud'],
  [TransactionCategory.DEBT_REPAYMENT]: ['credit card payment', 'student loan payment', 'auto loan', 'debt transfer'],
  [TransactionCategory.SAVINGS_TRANSFER]: ['transfer to savings', 'wealthfront', 'vanguard', 'fidelity', 'betterment'],
  [TransactionCategory.MISCELLANEOUS]: ['atm withdrawal', 'fee', 'general', 'other']
};

export const SUPPORTED_CURRENCIES: Record<string, { symbol: string; name: string; rateToUSD: number }> = {
  USD: { symbol: '$', name: 'US Dollar', rateToUSD: 1.0 },
  EUR: { symbol: '€', name: 'Euro', rateToUSD: 1.09 },
  GBP: { symbol: '£', name: 'British Pound', rateToUSD: 1.28 },
  CAD: { symbol: 'CA$', name: 'Canadian Dollar', rateToUSD: 0.74 },
  AUD: { symbol: 'A$', name: 'Australian Dollar', rateToUSD: 0.66 },
  JPY: { symbol: '¥', name: 'Japanese Yen', rateToUSD: 0.0068 },
  INR: { symbol: '₹', name: 'Indian Rupee', rateToUSD: 0.012 }
};
