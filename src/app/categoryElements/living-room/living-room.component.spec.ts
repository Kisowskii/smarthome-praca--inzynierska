import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivingRoomComponent } from './living-room.component';

describe('LivingRoomComponent', () => {
  let component: LivingRoomComponent;
  let fixture: ComponentFixture<LivingRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LivingRoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivingRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
