/* tslint:disable */
/* eslint-disable */
import { RateReviewMaxAndMinAmount } from './rate-review-max-and-min-amount';

/**
 * Data limits of settled amounts.
 */
export interface DataLimitsAmountsSettled {
  /**
   * Maximum annual.
   */
  maxAnnual?: number;

  /**
   * Maximum quarterly.
   */
  maxQuarterly?: number;

  /**
   * Minimum annual.
   */
  minAnnual?: number;

  /**
   * Minimum quarterly.
   */
  minQuarterly?: number;
  isRevalued?: boolean;
  rateReviewMaxAndMinAmount?: RateReviewMaxAndMinAmount;
}
