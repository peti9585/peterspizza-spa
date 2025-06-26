import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDetailsMainComponent } from './personal-details-main.component';

describe('PersonalDetailsMainComponent', () => {
  let component: PersonalDetailsMainComponent;
  let fixture: ComponentFixture<PersonalDetailsMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalDetailsMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalDetailsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
