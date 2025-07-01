import { TestBed } from '@angular/core/testing';

import { ValidacionUsuariosService } from './validacion-usuarios.service';

describe('ValidacionUsuariosService', () => {
  let service: ValidacionUsuariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidacionUsuariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
