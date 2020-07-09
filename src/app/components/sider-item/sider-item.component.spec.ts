import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiderItemComponent } from './sider-item.component';

describe('SiderItemComponent', () => {
  let component: SiderItemComponent;
  let fixture: ComponentFixture<SiderItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiderItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
