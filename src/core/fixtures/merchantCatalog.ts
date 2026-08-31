import { TransactionCategory } from '../types';

export interface MerchantMetadata {
  mccCode: string;
  merchantName: string;
  normalizedName: string;
  defaultCategory: TransactionCategory;
  subcategory: string;
  typicalAmountRange: { min: number; max: number };
  isSubscriptionProvider: boolean;
  websiteUrl: string;
  logoUrl: string;
}

export const GLOBAL_MERCHANT_CATALOG: MerchantMetadata[] = [
  // Groceries & Supermarkets
  { mccCode: '5411', merchantName: 'Trader Joe\'s', normalizedName: 'traderjoes', defaultCategory: TransactionCategory.GROCERIES, subcategory: 'Supermarket', typicalAmountRange: { min: 35.00, max: 220.00 }, isSubscriptionProvider: false, websiteUrl: 'https://traderjoes.com', logoUrl: 'https://cdn.vaultflow.demo/merchants/traderjoes.png' },
  { mccCode: '5411', merchantName: 'Whole Foods Market', normalizedName: 'wholefoods', defaultCategory: TransactionCategory.GROCERIES, subcategory: 'Organic Supermarket', typicalAmountRange: { min: 45.00, max: 350.00 }, isSubscriptionProvider: false, websiteUrl: 'https://wholefoodsmarket.com', logoUrl: 'https://cdn.vaultflow.demo/merchants/wholefoods.png' },
  { mccCode: '5411', merchantName: 'Walmart Supercenter', normalizedName: 'walmart', defaultCategory: TransactionCategory.GROCERIES, subcategory: 'Hypermarket', typicalAmountRange: { min: 20.00, max: 400.00 }, isSubscriptionProvider: false, websiteUrl: 'https://walmart.com', logoUrl: 'https://cdn.vaultflow.demo/merchants/walmart.png' },
  { mccCode: '5411', merchantName: 'Target Corporation', normalizedName: 'target', defaultCategory: TransactionCategory.SHOPPING, subcategory: 'Department Store', typicalAmountRange: { min: 15.00, max: 250.00 }, isSubscriptionProvider: false, websiteUrl: 'https://target.com', logoUrl: 'https://cdn.vaultflow.demo/merchants/target.png' },
  { mccCode: '5411', merchantName: 'Costco Wholesale', normalizedName: 'costco', defaultCategory: TransactionCategory.GROCERIES, subcategory: 'Wholesale Club', typicalAmountRange: { min: 120.00, max: 650.00 }, isSubscriptionProvider: true, websiteUrl: 'https://costco.com', logoUrl: 'https://cdn.vaultflow.demo/merchants/costco.png' },
  { mccCode: '5411', merchantName: 'Kroger Grocery', normalizedName: 'kroger', defaultCategory: TransactionCategory.GROCERIES, subcategory: 'Supermarket', typicalAmountRange: { min: 30.00, max: 200.00 }, isSubscriptionProvider: false, websiteUrl: 'https://kroger.com', logoUrl: 'https://cdn.vaultflow.demo/merchants/kroger.png' },
  { mccCode: '5411', merchantName: 'Aldi Food Stores', normalizedName: 'aldi', defaultCategory: TransactionCategory.GROCERIES, subcategory: 'Discount Grocery', typicalAmountRange: { min: 25.00, max: 150.00 }, isSubscriptionProvider: false, websiteUrl: 'https://aldi.us', logoUrl: 'https://cdn.vaultflow.demo/merchants/aldi.png' },

  // Dining & Coffee
  { mccCode: '5812', merchantName: 'Starbucks Coffee', normalizedName: 'starbucks', defaultCategory: TransactionCategory.DINING, subcategory: 'Coffee Shop', typicalAmountRange: { min: 4.50, max: 22.00 }, isSubscriptionProvider: false, websiteUrl: 'https://starbucks.com', logoUrl: 'https://cdn.vaultflow.demo/merchants/starbucks.png' },
  { mccCode: '5814', merchantName: 'Chipotle Mexican Grill', normalizedName: 'chipotle', defaultCategory: TransactionCategory.DINING, subcategory: 'Fast Casual', typicalAmountRange: { min: 12.50, max: 38.00 }, isSubscriptionProvider: false, websiteUrl: 'https://chipotle.com', logoUrl: 'https://cdn.vaultflow.demo/merchants/chipotle.png' },
  { mccCode: '5814', merchantName: 'McDonald\'s', normalizedName: 'mcdonalds', defaultCategory: TransactionCategory.DINING, subcategory: 'Fast Food', typicalAmountRange: { min: 6.00, max: 25.00 }, isSubscriptionProvider: false, websiteUrl: 'https://mcdonalds.com', logoUrl: 'https://cdn.vaultflow.demo/merchants/mcdonalds.png' },
  { mccCode: '5812', merchantName: 'Uber Eats Food Delivery', normalizedName: 'ubereats', defaultCategory: TransactionCategory.DINING, subcategory: 'Delivery', typicalAmountRange: { min: 20.00, max: 75.00 }, isSubscriptionProvider: true, websiteUrl: 'https://ubereats.com', logoUrl: 'https://cdn.vaultflow.demo/merchants/ubereats.png' },
  { mccCode: '5812', merchantName: 'DoorDash Delivery', normalizedName: 'doordash', defaultCategory: TransactionCategory.DINING, subcategory: 'Delivery', typicalAmountRange: { min: 22.00, max: 80.00 }, isSubscriptionProvider: true, websiteUrl: 'https://doordash.com', logoUrl: 'https://cdn.vaultflow.demo/merchants/doordash.png' },

  // Subscriptions & Digital Services
  { mccCode: '4899', merchantName: 'Netflix Digital', normalizedName: 'netflix', defaultCategory: TransactionCategory.ENTERTAINMENT, subcategory: 'Streaming Video', typicalAmountRange: { min: 15.49, max: 22.99 }, isSubscriptionProvider: true, websiteUrl: 'https://netflix.com', logoUrl: 'https://cdn.vaultflow.demo/merchants/netflix.png' },
  { mccCode: '4899', merchantName: 'Spotify AB', normalizedName: 'spotify', defaultCategory: TransactionCategory.ENTERTAINMENT, subcategory: 'Streaming Music', typicalAmountRange: { min: 10.99, max: 16.99 }, isSubscriptionProvider: true, websiteUrl: 'https://spotify.com', logoUrl: 'https://cdn.vaultflow.demo/merchants/spotify.png' },
  { mccCode: '4899', merchantName: 'OpenAI ChatGPT Plus', normalizedName: 'openai', defaultCategory: TransactionCategory.SUBSCRIPTIONS, subcategory: 'AI Services', typicalAmountRange: { min: 20.00, max: 20.00 }, isSubscriptionProvider: true, websiteUrl: 'https://openai.com', logoUrl: 'https://cdn.vaultflow.demo/merchants/openai.png' },
  { mccCode: '4899', merchantName: 'GitHub Enterprise', normalizedName: 'github', defaultCategory: TransactionCategory.SUBSCRIPTIONS, subcategory: 'Developer Tools', typicalAmountRange: { min: 10.00, max: 49.00 }, isSubscriptionProvider: true, websiteUrl: 'https://github.com', logoUrl: 'https://cdn.vaultflow.demo/merchants/github.png' },
  { mccCode: '4899', merchantName: 'Amazon Prime Subscription', normalizedName: 'amazonprime', defaultCategory: TransactionCategory.SUBSCRIPTIONS, subcategory: 'E-Commerce Membership', typicalAmountRange: { min: 14.99, max: 139.00 }, isSubscriptionProvider: true, websiteUrl: 'https://amazon.com/prime', logoUrl: 'https://cdn.vaultflow.demo/merchants/amazonprime.png' }
];

export function findMerchantByName(rawName: string): MerchantMetadata | undefined {
  const clean = rawName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return GLOBAL_MERCHANT_CATALOG.find(m => clean.includes(m.normalizedName) || m.normalizedName.includes(clean));
}
