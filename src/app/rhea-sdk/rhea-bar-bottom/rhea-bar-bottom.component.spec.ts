import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RheaBarBottomComponent } from './rhea-bar-bottom.component';

describe('RheaBarBottomComponent', () => {
  let component: RheaBarBottomComponent;
  let fixture: ComponentFixture<RheaBarBottomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RheaBarBottomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RheaBarBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
