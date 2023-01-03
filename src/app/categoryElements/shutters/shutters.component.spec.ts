import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShuttersComponent } from './shutters.component';

describe('ShuttersComponent', () => {
  let component: ShuttersComponent;
  let fixture: ComponentFixture<ShuttersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShuttersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShuttersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
