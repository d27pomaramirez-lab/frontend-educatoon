import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgresoAcademicoComponent } from './progreso.academico.component';

describe('ProgresoAcademicoComponent', () => {
  let component: ProgresoAcademicoComponent;
  let fixture: ComponentFixture<ProgresoAcademicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgresoAcademicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgresoAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
