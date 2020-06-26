import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuTreeComponent } from './menu-tree.component';

describe('MenuTreeComponent', () => {
  let component: MenuTreeComponent;
  let fixture: ComponentFixture<MenuTreeComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuTreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
