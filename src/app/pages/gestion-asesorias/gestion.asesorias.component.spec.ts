import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAsesoriasComponent } from './gestion.asesorias.component';

describe('GestionAsesorias', () => {
  let component: GestionAsesoriasComponent;
  let fixture: ComponentFixture<GestionAsesoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionAsesoriasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionAsesoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
