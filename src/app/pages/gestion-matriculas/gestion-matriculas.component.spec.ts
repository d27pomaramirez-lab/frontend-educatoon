import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionMatriculasComponent } from './gestion-matriculas.component';

describe('GestionMatriculasComponent', () => {
  let component: GestionMatriculasComponent;
  let fixture: ComponentFixture<GestionMatriculasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionMatriculasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionMatriculasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
