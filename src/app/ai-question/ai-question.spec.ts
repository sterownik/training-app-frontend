import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiQuestion } from './ai-question';

describe('AiQuestion', () => {
  let component: AiQuestion;
  let fixture: ComponentFixture<AiQuestion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiQuestion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiQuestion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
