import { TestBed } from '@angular/core/testing';

import { CognitoService } from './cognito-service';

describe('CognitoServiceService', () => {
  let service: CognitoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CognitoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
