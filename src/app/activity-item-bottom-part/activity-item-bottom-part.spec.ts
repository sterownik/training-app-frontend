import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityItemBottomPart } from './activity-item-bottom-part';

describe('ActivityItemBottomPart', () => {
  let component: ActivityItemBottomPart;
  let fixture: ComponentFixture<ActivityItemBottomPart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityItemBottomPart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityItemBottomPart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
