import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteAsignacionesComponent } from './reporte-asignaciones.component';

describe('ReporteAsignacionesComponent', () => {
  let component: ReporteAsignacionesComponent;
  let fixture: ComponentFixture<ReporteAsignacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteAsignacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteAsignacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
