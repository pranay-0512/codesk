import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionControlComponent } from './version-control.component';

describe('VersionControlComponent', () => {
  let component: VersionControlComponent;
  let fixture: ComponentFixture<VersionControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VersionControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VersionControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
