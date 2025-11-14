import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinadorPanel } from './coordinador-panel';

describe('CoordinadorPanel', () => {
  let component: CoordinadorPanel;
  let fixture: ComponentFixture<CoordinadorPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinadorPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordinadorPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
