import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loggingGuard } from './logging-guard';

describe('loggingGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loggingGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
