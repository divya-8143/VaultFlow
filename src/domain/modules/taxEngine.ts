import { US_FEDERAL_TAX_SCHEDULE_2026, US_STATE_TAX_SCHEDULES } from '../../core/fixtures/taxSchedules';
import { FinancialMath } from '../../core/utils/math';

export interface TaxEstimateResult {
  grossIncome: number;
  filingStatus: 'SINGLE' | 'JOINT' | 'HEAD_OF_HOUSEHOLD';
  stateCode: string;
  federalStandardDeduction: number;
  stateStandardDeduction: number;
  federalTaxableIncome: number;
  stateTaxableIncome: number;
  federalTaxOwed: number;
  stateTaxOwed: number;
  totalTaxLiability: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
}

export class TaxEngine {
  public static calculateEstimate(
    grossIncome: number,
    filingStatus: 'SINGLE' | 'JOINT' | 'HEAD_OF_HOUSEHOLD' = 'SINGLE',
    stateCode: string = 'CA'
  ): TaxEstimateResult {
    const fed = US_FEDERAL_TAX_SCHEDULE_2026;
    let fedDeduction = fed.standardDeductionSingle;
    let fedBrackets = fed.bracketsSingle;

    if (filingStatus === 'JOINT') {
      fedDeduction = fed.standardDeductionJoint;
      fedBrackets = fed.bracketsJoint;
    } else if (filingStatus === 'HEAD_OF_HOUSEHOLD') {
      fedDeduction = fed.standardDeductionHeadOfHousehold;
      fedBrackets = fed.bracketsHeadOfHousehold;
    }

    const federalTaxableIncome = Math.max(0, grossIncome - fedDeduction);
    let federalTaxOwed = 0;
    let marginalTaxRate = 0;

    for (const b of fedBrackets) {
      if (federalTaxableIncome > b.minIncome) {
        const taxableAmountInBracket = Math.min(federalTaxableIncome, b.maxIncome) - b.minIncome;
        federalTaxOwed += taxableAmountInBracket * (b.ratePercentage / 100);
        marginalTaxRate = b.ratePercentage;
      }
    }

    // State calculation
    const stateSched = US_STATE_TAX_SCHEDULES[stateCode] || US_STATE_TAX_SCHEDULES['FL'];
    let stateDeduction = 0;
    let stateTaxableIncome = 0;
    let stateTaxOwed = 0;

    if (stateSched && stateSched.hasStateIncomeTax) {
      stateDeduction = filingStatus === 'JOINT' ? stateSched.standardDeductionJoint : stateSched.standardDeductionSingle;
      stateTaxableIncome = Math.max(0, grossIncome - stateDeduction);
      const stateBrackets = filingStatus === 'JOINT' ? stateSched.bracketsJoint : stateSched.bracketsSingle;

      for (const b of stateBrackets) {
        if (stateTaxableIncome > b.minIncome) {
          const taxableInBracket = Math.min(stateTaxableIncome, b.maxIncome) - b.minIncome;
          stateTaxOwed += taxableInBracket * (b.ratePercentage / 100);
        }
      }
    }

    const totalTaxLiability = FinancialMath.round2(federalTaxOwed + stateTaxOwed);
    const effectiveTaxRate = grossIncome > 0 ? FinancialMath.round2((totalTaxLiability / grossIncome) * 100) : 0;

    return {
      grossIncome: FinancialMath.round2(grossIncome),
      filingStatus,
      stateCode,
      federalStandardDeduction: fedDeduction,
      stateStandardDeduction: stateDeduction,
      federalTaxableIncome: FinancialMath.round2(federalTaxableIncome),
      stateTaxableIncome: FinancialMath.round2(stateTaxableIncome),
      federalTaxOwed: FinancialMath.round2(federalTaxOwed),
      stateTaxOwed: FinancialMath.round2(stateTaxOwed),
      totalTaxLiability,
      effectiveTaxRate,
      marginalTaxRate
    };
  }
}
