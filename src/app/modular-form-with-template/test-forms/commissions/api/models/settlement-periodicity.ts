/* tslint:disable */
/* eslint-disable */
import { Calendar } from './calendar';
import { PaymentPeriodicityType } from './payment-periodicity-type';

/**
 * Settlement periodicity.
 */
export interface SettlementPeriodicity {
  /**
   * Calendars.
   */
  calendars?: Array<Calendar>;

  /**
   * First settlement date
   */
  firstSettlementDate?: string;

  /**
   * Last settlement date
   */
  lastSettlementDate?: string;

  /**
   * Next settlement date
   */
  nextSettlementDate?: string;
  paymentPeriodicity?: PaymentPeriodicityType;

  /**
   * Settlement day.
   */
  periodicityDay?: number;

  /**
   * Periodicity code.
   */
  periodicityMonthsCode?: number;

  /**
   * Periodicity name.
   */
  periodicityMonthsValue?: string;
}
