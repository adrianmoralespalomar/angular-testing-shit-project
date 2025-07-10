/* tslint:disable */
/* eslint-disable */
import { ReferenceCaptureDateType } from './reference-capture-date-type';

/**
 * Data for calculating the rate to be applied.
 */
export interface DataCalculationRateToApply {
  /**
   * Differential.
   */
  differential?: number;

  /**
   * Maximum final rate.
   */
  maxFinalRate?: number;

  /**
   * Maximum referential.
   */
  maxReferential?: number;

  /**
   * Minimum final rate.
   */
  minFinalRate?: number;

  /**
   * Minimum referential.
   */
  minReferential?: number;
  referentialCaptureDate?: ReferenceCaptureDateType;

  /**
   * Referential identifier.
   */
  referentialId?: number;

  /**
   * Referential name.
   */
  referentialValue?: string;
}
