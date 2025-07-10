import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Commission } from '../models/commission';
import { ObtainingAmountType } from '../models/obtaining-amount-type';
import { PaymentPeriodicityType } from '../models/payment-periodicity-type';
import { SettlementType } from '../models/settlement-type';

@Injectable({
  providedIn: 'root',
})
export class CommissionsService {
  constructor() {}

  getCommissionData(): Observable<Commission> {
    return of(getCommissionDataMock).pipe(delay(1000));
  }
}

export const getCommissionDataMock: Commission = {
  accrues: true,
  bankPays: true,
  dataLimitsAmountsSettled: {
    isRevalued: true,
  },
  fundId: 1257,
  isManagement: true,
  name: 'Commision 1',
  reflectInCascade: true,
  settlementPeriodicity: {
    calendars: [{ calendarId: '1', description: 'Vigo' }],
    firstSettlementDate: '2025-07-02',
    paymentPeriodicity: PaymentPeriodicityType.Periodico,
    periodicityDay: 2,
    periodicityMonthsCode: 1,
  },
  settlementType: SettlementType.Anticipada,
  targetAmount: {
    applyFormula: false,
    fixedAmount: 1234567.35,
    obtainingAmount: ObtainingAmountType.ImporteFijo,
    rateApplies: false,
  },
};
