import { TestBed } from '@angular/core/testing';

import { ArriendosService } from './arriendos.service';

describe('ArriendosService', () => {
  let service: ArriendosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArriendosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
