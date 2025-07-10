/* tslint:disable */
/* eslint-disable */
import { CommissionAccounts } from './commission-accounts';
import { DataLimitsAmountsSettled } from './data-limits-amounts-settled';
import { SettlementPeriodicity } from './settlement-periodicity';
import { SettlementType } from './settlement-type';
import { TargetAmount } from './target-amount';

/**
 * Data structure containing information about additional remuneration for performing an investment plan operation
 */
export interface Commission {
  /**
   * Accrues.
   */
  accrues?: boolean;

  /**
   * Bank pays.
   */
  bankPays?: boolean;

  /**
   * Cascade A or B.
   */
  cascadeIndex?: number;
  dataLimitsAmountsSettled?: DataLimitsAmountsSettled;

  /**
   * (EN) Longer descriptive with information relevant to management
   */
  description_en?: string;

  /**
   * (ES) Longer descriptive with information relevant to management
   */
  description_es?: string;

  /**
   * Fund identifier.
   */
  fundId?: number;

  /**
   * Is management commission.
   */
  isManagement?: boolean;

  /**
   * Is revalued?.
   */
  isRevalued?: boolean;

  /**
   * Cascade order.
   */
  modifiedOrder?: number;

  /**
   * Name given to identify the commission in management.
   */
  name?: string;

  /**
   * Reflect in cascade.
   */
  reflectInCascade?: boolean;
  settlementPeriodicity?: SettlementPeriodicity;
  settlementType?: SettlementType;
  syntheticAccount?: CommissionAccounts;
  targetAmount?: TargetAmount;
  traditionalAccount?: CommissionAccounts;
}
