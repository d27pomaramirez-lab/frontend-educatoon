import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionSeccionesComponent } from './gestion.secciones.component';

describe('GestionSecciones', () => {
  let component: GestionSeccionesComponent;
  let fixture: ComponentFixture<GestionSeccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionSeccionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionSeccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
