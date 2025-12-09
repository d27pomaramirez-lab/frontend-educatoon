import { TestBed } from '@angular/core/testing';

import { PruebaEntradaService } from './prueba-entrada.service';

describe('PruebaEntradaService', () => {
  let service: PruebaEntradaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PruebaEntradaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
