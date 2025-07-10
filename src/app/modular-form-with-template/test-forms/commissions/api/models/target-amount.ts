/* tslint:disable */
/* eslint-disable */
import { CalculationFinalSettlementType } from './calculation-final-settlement-type';
import { DataCalculationRateToApply } from './data-calculation-rate-to-apply';
import { ObtainingAmountType } from './obtaining-amount-type';
import { RateType } from './rate-type';

/**
 * Target amount.
 */
export interface TargetAmount {
  /**
   * Apply formula.
   */
  applyFormula?: boolean;
  calculationFinalSettlement?: CalculationFinalSettlementType;
  dataCalculationRateToApply?: DataCalculationRateToApply;

  /**
   * Fixed amount.
   */
  fixedAmount?: number;

  /**
   * Fund field identifier.
   */
  fundFieldId?: number;

  /**
   * Fund field name.
   */
  fundFieldValue?: string;
  obtainingAmount?: ObtainingAmountType;

  /**
   * Rate amount.
   */
  rateAmount?: number;

  /**
   * Rate applies.
   */
  rateApplies?: boolean;
  rateType?: RateType;

  /**
   * Type to apply.
   */
  typeToApply?: number;
}
