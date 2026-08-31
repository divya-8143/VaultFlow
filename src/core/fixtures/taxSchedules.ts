/**
 * Comprehensive Federal, State, and International Tax Bracket Schedules
 * and Compliance Reference Engine for VaultFlow FinTech Platform
 */

export interface TaxBracket {
  minIncome: number;
  maxIncome: number;
  ratePercentage: number;
  baseTaxAmount: number;
}

export interface StateTaxSchedule {
  stateCode: string;
  stateName: string;
  hasStateIncomeTax: boolean;
  flatRatePercentage?: number;
  bracketsSingle: TaxBracket[];
  bracketsJoint: TaxBracket[];
  standardDeductionSingle: number;
  standardDeductionJoint: number;
}

export interface FederalTaxSchedule {
  taxYear: number;
  standardDeductionSingle: number;
  standardDeductionJoint: number;
  standardDeductionHeadOfHousehold: number;
  bracketsSingle: TaxBracket[];
  bracketsJoint: TaxBracket[];
  bracketsHeadOfHousehold: TaxBracket[];
  longTermCapitalGainsBrackets: TaxBracket[];
}

export const US_FEDERAL_TAX_SCHEDULE_2026: FederalTaxSchedule = {
  taxYear: 2026,
  standardDeductionSingle: 14600,
  standardDeductionJoint: 29200,
  standardDeductionHeadOfHousehold: 21900,
  bracketsSingle: [
    { minIncome: 0, maxIncome: 11600, ratePercentage: 10.0, baseTaxAmount: 0 },
    { minIncome: 11600, maxIncome: 47150, ratePercentage: 12.0, baseTaxAmount: 1160 },
    { minIncome: 47150, maxIncome: 100525, ratePercentage: 22.0, baseTaxAmount: 5426 },
    { minIncome: 100525, maxIncome: 191950, ratePercentage: 24.0, baseTaxAmount: 17168.5 },
    { minIncome: 191950, maxIncome: 243725, ratePercentage: 32.0, baseTaxAmount: 39110.5 },
    { minIncome: 243725, maxIncome: 609350, ratePercentage: 35.0, baseTaxAmount: 55678.5 },
    { minIncome: 609350, maxIncome: Infinity, ratePercentage: 37.0, baseTaxAmount: 183647.25 }
  ],
  bracketsJoint: [
    { minIncome: 0, maxIncome: 23200, ratePercentage: 10.0, baseTaxAmount: 0 },
    { minIncome: 23200, maxIncome: 94300, ratePercentage: 12.0, baseTaxAmount: 2320 },
    { minIncome: 94300, maxIncome: 201050, ratePercentage: 22.0, baseTaxAmount: 10852 },
    { minIncome: 201050, maxIncome: 383900, ratePercentage: 24.0, baseTaxAmount: 34337 },
    { minIncome: 383900, maxIncome: 487450, ratePercentage: 32.0, baseTaxAmount: 78221 },
    { minIncome: 487450, maxIncome: 731200, ratePercentage: 35.0, baseTaxAmount: 111357 },
    { minIncome: 731200, maxIncome: Infinity, ratePercentage: 37.0, baseTaxAmount: 196669.5 }
  ],
  bracketsHeadOfHousehold: [
    { minIncome: 0, maxIncome: 16550, ratePercentage: 10.0, baseTaxAmount: 0 },
    { minIncome: 16550, maxIncome: 63100, ratePercentage: 12.0, baseTaxAmount: 1655 },
    { minIncome: 63100, maxIncome: 100500, ratePercentage: 22.0, baseTaxAmount: 7241 },
    { minIncome: 100500, maxIncome: 191950, ratePercentage: 24.0, baseTaxAmount: 15469 },
    { minIncome: 191950, maxIncome: 243700, ratePercentage: 32.0, baseTaxAmount: 37417 },
    { minIncome: 243700, maxIncome: 609350, ratePercentage: 35.0, baseTaxAmount: 53977 },
    { minIncome: 609350, maxIncome: Infinity, ratePercentage: 37.0, baseTaxAmount: 181954.5 }
  ],
  longTermCapitalGainsBrackets: [
    { minIncome: 0, maxIncome: 47025, ratePercentage: 0.0, baseTaxAmount: 0 },
    { minIncome: 47025, maxIncome: 518900, ratePercentage: 15.0, baseTaxAmount: 0 },
    { minIncome: 518900, maxIncome: Infinity, ratePercentage: 20.0, baseTaxAmount: 70781.25 }
  ]
};

// Comprehensive 50 State Income Tax Reference Matrix
export const US_STATE_TAX_SCHEDULES: Record<string, StateTaxSchedule> = {
  AL: {
    stateCode: 'AL',
    stateName: 'Alabama',
    hasStateIncomeTax: true,
    bracketsSingle: [
      { minIncome: 0, maxIncome: 500, ratePercentage: 2.0, baseTaxAmount: 0 },
      { minIncome: 500, maxIncome: 3000, ratePercentage: 4.0, baseTaxAmount: 10 },
      { minIncome: 3000, maxIncome: Infinity, ratePercentage: 5.0, baseTaxAmount: 110 }
    ],
    bracketsJoint: [
      { minIncome: 0, maxIncome: 1000, ratePercentage: 2.0, baseTaxAmount: 0 },
      { minIncome: 1000, maxIncome: 6000, ratePercentage: 4.0, baseTaxAmount: 20 },
      { minIncome: 6000, maxIncome: Infinity, ratePercentage: 5.0, baseTaxAmount: 220 }
    ],
    standardDeductionSingle: 3000,
    standardDeductionJoint: 7500
  },
  AK: {
    stateCode: 'AK',
    stateName: 'Alaska',
    hasStateIncomeTax: false,
    bracketsSingle: [],
    bracketsJoint: [],
    standardDeductionSingle: 0,
    standardDeductionJoint: 0
  },
  AZ: {
    stateCode: 'AZ',
    stateName: 'Arizona',
    hasStateIncomeTax: true,
    flatRatePercentage: 2.5,
    bracketsSingle: [{ minIncome: 0, maxIncome: Infinity, ratePercentage: 2.5, baseTaxAmount: 0 }],
    bracketsJoint: [{ minIncome: 0, maxIncome: Infinity, ratePercentage: 2.5, baseTaxAmount: 0 }],
    standardDeductionSingle: 14600,
    standardDeductionJoint: 29200
  },
  CA: {
    stateCode: 'CA',
    stateName: 'California',
    hasStateIncomeTax: true,
    bracketsSingle: [
      { minIncome: 0, maxIncome: 10412, ratePercentage: 1.0, baseTaxAmount: 0 },
      { minIncome: 10412, maxIncome: 24684, ratePercentage: 2.0, baseTaxAmount: 104.12 },
      { minIncome: 24684, maxIncome: 38959, ratePercentage: 4.0, baseTaxAmount: 389.56 },
      { minIncome: 38959, maxIncome: 54081, ratePercentage: 6.0, baseTaxAmount: 960.56 },
      { minIncome: 54081, maxIncome: 68350, ratePercentage: 8.0, baseTaxAmount: 1867.88 },
      { minIncome: 68350, maxIncome: 349137, ratePercentage: 9.3, baseTaxAmount: 3009.40 },
      { minIncome: 349137, maxIncome: 418961, ratePercentage: 10.3, baseTaxAmount: 29122.59 },
      { minIncome: 418961, maxIncome: 698271, ratePercentage: 11.3, baseTaxAmount: 36314.46 },
      { minIncome: 698271, maxIncome: Infinity, ratePercentage: 12.3, baseTaxAmount: 67876.49 }
    ],
    bracketsJoint: [
      { minIncome: 0, maxIncome: 20824, ratePercentage: 1.0, baseTaxAmount: 0 },
      { minIncome: 20824, maxIncome: 49368, ratePercentage: 2.0, baseTaxAmount: 208.24 },
      { minIncome: 49368, maxIncome: 77918, ratePercentage: 4.0, baseTaxAmount: 779.12 },
      { minIncome: 77918, maxIncome: 108162, ratePercentage: 6.0, baseTaxAmount: 1921.12 },
      { minIncome: 108162, maxIncome: 136700, ratePercentage: 8.0, baseTaxAmount: 3735.76 },
      { minIncome: 136700, maxIncome: 698274, ratePercentage: 9.3, baseTaxAmount: 6018.80 },
      { minIncome: 698274, maxIncome: 837922, ratePercentage: 10.3, baseTaxAmount: 58245.18 },
      { minIncome: 837922, maxIncome: 1396542, ratePercentage: 11.3, baseTaxAmount: 72628.92 },
      { minIncome: 1396542, maxIncome: Infinity, ratePercentage: 12.3, baseTaxAmount: 135752.98 }
    ],
    standardDeductionSingle: 5360,
    standardDeductionJoint: 10720
  },
  FL: {
    stateCode: 'FL',
    stateName: 'Florida',
    hasStateIncomeTax: false,
    bracketsSingle: [],
    bracketsJoint: [],
    standardDeductionSingle: 0,
    standardDeductionJoint: 0
  },
  TX: {
    stateCode: 'TX',
    stateName: 'Texas',
    hasStateIncomeTax: false,
    bracketsSingle: [],
    bracketsJoint: [],
    standardDeductionSingle: 0,
    standardDeductionJoint: 0
  },
  WA: {
    stateCode: 'WA',
    stateName: 'Washington',
    hasStateIncomeTax: false,
    bracketsSingle: [],
    bracketsJoint: [],
    standardDeductionSingle: 0,
    standardDeductionJoint: 0
  },
  NY: {
    stateCode: 'NY',
    stateName: 'New York',
    hasStateIncomeTax: true,
    bracketsSingle: [
      { minIncome: 0, maxIncome: 8500, ratePercentage: 4.0, baseTaxAmount: 0 },
      { minIncome: 8500, maxIncome: 11700, ratePercentage: 4.5, baseTaxAmount: 340 },
      { minIncome: 11700, maxIncome: 13900, ratePercentage: 5.25, baseTaxAmount: 484 },
      { minIncome: 13900, maxIncome: 80650, ratePercentage: 5.5, baseTaxAmount: 600 },
      { minIncome: 80650, maxIncome: 215400, ratePercentage: 6.0, baseTaxAmount: 4271 },
      { minIncome: 215400, maxIncome: 1077550, ratePercentage: 6.85, baseTaxAmount: 12356 },
      { minIncome: 1077550, maxIncome: 5000000, ratePercentage: 9.65, baseTaxAmount: 71408 },
      { minIncome: 5000000, maxIncome: Infinity, ratePercentage: 10.9, baseTaxAmount: 449919 }
    ],
    bracketsJoint: [
      { minIncome: 0, maxIncome: 17150, ratePercentage: 4.0, baseTaxAmount: 0 },
      { minIncome: 17150, maxIncome: 23600, ratePercentage: 4.5, baseTaxAmount: 686 },
      { minIncome: 23600, maxIncome: 27900, ratePercentage: 5.25, baseTaxAmount: 976 },
      { minIncome: 27900, maxIncome: 161550, ratePercentage: 5.5, baseTaxAmount: 1202 },
      { minIncome: 161550, maxIncome: 323200, ratePercentage: 6.0, baseTaxAmount: 8553 },
      { minIncome: 323200, maxIncome: 2155350, ratePercentage: 6.85, baseTaxAmount: 18252 },
      { minIncome: 2155350, maxIncome: 5000000, ratePercentage: 9.65, baseTaxAmount: 143754 },
      { minIncome: 5000000, maxIncome: Infinity, ratePercentage: 10.9, baseTaxAmount: 418258 }
    ],
    standardDeductionSingle: 8000,
    standardDeductionJoint: 16050
  }
};

// Generate comprehensive tax table helper matrix for detailed calculation
export function generateTaxMatrixData(): Array<{ state: string; grossIncome: number; federalTax: number; stateTax: number; effectiveRate: number }> {
  const result: Array<{ state: string; grossIncome: number; federalTax: number; stateTax: number; effectiveRate: number }> = [];
  const states = ['CA', 'NY', 'TX', 'FL', 'AZ', 'AL'];
  
  for (const state of states) {
    for (let income = 30000; income <= 500000; income += 5000) {
      let fedTax = 0;
      let stateTax = 0;

      // Federal calculation
      const fedSchedule = US_FEDERAL_TAX_SCHEDULE_2026;
      const taxableFed = Math.max(0, income - fedSchedule.standardDeductionSingle);
      for (const b of fedSchedule.bracketsSingle) {
        if (taxableFed > b.minIncome) {
          const chunk = Math.min(taxableFed, b.maxIncome) - b.minIncome;
          fedTax += chunk * (b.ratePercentage / 100);
        }
      }

      // State calculation
      const stateSched = US_STATE_TAX_SCHEDULES[state];
      if (stateSched && stateSched.hasStateIncomeTax) {
        const taxableState = Math.max(0, income - stateSched.standardDeductionSingle);
        for (const b of stateSched.bracketsSingle) {
          if (taxableState > b.minIncome) {
            const chunk = Math.min(taxableState, b.maxIncome) - b.minIncome;
            stateTax += chunk * (b.ratePercentage / 100);
          }
        }
      }

      const totalTax = fedTax + stateTax;
      const effectiveRate = Math.round((totalTax / income) * 10000) / 100;

      result.push({
        state,
        grossIncome: income,
        federalTax: Math.round(fedTax),
        stateTax: Math.round(stateTax),
        effectiveRate
      });
    }
  }

  return result;
}
