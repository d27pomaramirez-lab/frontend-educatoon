import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsesoriaEstudianteComponent } from './asesoria.estudiante.component';

describe('AsesoriaEstudiante', () => {
  let component: AsesoriaEstudianteComponent;
  let fixture: ComponentFixture<AsesoriaEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsesoriaEstudianteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsesoriaEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
