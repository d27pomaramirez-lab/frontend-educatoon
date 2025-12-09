import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioHorariosComponent } from './calendario-horarios.component';

describe('CalendarioHorariosComponent', () => {
  let component: CalendarioHorariosComponent;
  let fixture: ComponentFixture<CalendarioHorariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioHorariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioHorariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
