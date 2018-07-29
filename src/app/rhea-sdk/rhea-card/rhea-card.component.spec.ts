import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RheaCardComponent } from './rhea-card.component';

describe('RheaCardComponent', () => {
  let component: RheaCardComponent;
  let fixture: ComponentFixture<RheaCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RheaCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RheaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
