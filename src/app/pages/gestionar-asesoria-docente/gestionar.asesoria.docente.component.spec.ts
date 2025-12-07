import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarAsesoriaDocenteComponent } from './gestionar.asesoria.docente.component';

describe('Gestionarasesoriadocente', () => {
  let component: GestionarAsesoriaDocenteComponent;
  let fixture: ComponentFixture<GestionarAsesoriaDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarAsesoriaDocenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarAsesoriaDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
