import { TestBed } from '@angular/core/testing';

import { ProgresoAcademicoService } from './progreso-academico.service';

describe('ProgresoAcademicoService', () => {
  let service: ProgresoAcademicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgresoAcademicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
