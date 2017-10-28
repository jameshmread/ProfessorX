import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutationFiltersComponent } from './mutation-filters.component';

describe('MutationFiltersComponent', () => {
  let component: MutationFiltersComponent;
  let fixture: ComponentFixture<MutationFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutationFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutationFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
