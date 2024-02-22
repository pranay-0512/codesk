import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateBoardsComponent } from './template-boards.component';

describe('TemplateBoardsComponent', () => {
  let component: TemplateBoardsComponent;
  let fixture: ComponentFixture<TemplateBoardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateBoardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
