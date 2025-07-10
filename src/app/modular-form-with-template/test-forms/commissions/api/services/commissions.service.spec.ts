/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { CommissionsService } from './commissions.service';

describe('Service: CommissionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommissionsService],
    });
  });

  it('should ...', inject([CommissionsService], (service: CommissionsService) => {
    expect(service).toBeTruthy();
  }));
});
