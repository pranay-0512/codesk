import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkBenchComponent } from './create-work-bench.component';

describe('CreateWorkBenchComponent', () => {
  let component: CreateWorkBenchComponent;
  let fixture: ComponentFixture<CreateWorkBenchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateWorkBenchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateWorkBenchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
