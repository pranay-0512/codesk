import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkBenchComponent } from './work-bench.component';

describe('WorkBenchComponent', () => {
  let component: WorkBenchComponent;
  let fixture: ComponentFixture<WorkBenchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkBenchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkBenchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
