import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CodeChangeDisplayComponent } from "./code-change-display.component";

describe("CodeChangeDisplayComponent", () => {
  let component: CodeChangeDisplayComponent;
  let fixture: ComponentFixture<CodeChangeDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeChangeDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeChangeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
