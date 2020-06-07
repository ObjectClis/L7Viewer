import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesPopupComponent } from './properties-popup.component';

describe('PropertiesPopupComponent', () => {
  let component: PropertiesPopupComponent;
  let fixture: ComponentFixture<PropertiesPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertiesPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
