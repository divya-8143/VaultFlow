import { SUPPORTED_CURRENCIES } from '../constants';

export class CurrencyUtils {
  /**
   * Convert amount from source currency to target currency via USD base
   */
  public static convert(amount: number, fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return amount;
    
    const fromInfo = SUPPORTED_CURRENCIES[fromCurrency] || SUPPORTED_CURRENCIES['USD'];
    const toInfo = SUPPORTED_CURRENCIES[toCurrency] || SUPPORTED_CURRENCIES['USD'];

    // Amount in USD = amount * fromInfo.rateToUSD
    const amountInUSD = amount * fromInfo.rateToUSD;
    // Amount in target = amountInUSD / toInfo.rateToUSD
    const amountInTarget = amountInUSD / toInfo.rateToUSD;

    return Math.round((amountInTarget + Number.EPSILON) * 100) / 100;
  }

  /**
   * Format currency for display
   */
  public static format(amount: number, currencyCode: string = 'USD'): string {
    const currencyInfo = SUPPORTED_CURRENCIES[currencyCode] || { symbol: '$' };
    const formattedAmount = amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `${currencyInfo.symbol}${formattedAmount}`;
  }
}
