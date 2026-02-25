import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dialoglaps } from './dialoglaps';

describe('Dialoglaps', () => {
  let component: Dialoglaps;
  let fixture: ComponentFixture<Dialoglaps>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dialoglaps]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dialoglaps);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
