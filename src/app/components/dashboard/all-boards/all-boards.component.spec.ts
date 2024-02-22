import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBoardsComponent } from './all-boards.component';

describe('AllBoardsComponent', () => {
  let component: AllBoardsComponent;
  let fixture: ComponentFixture<AllBoardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllBoardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
