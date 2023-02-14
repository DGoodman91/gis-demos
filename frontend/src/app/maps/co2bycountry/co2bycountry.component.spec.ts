import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Co2bycountryComponent } from './co2bycountry.component';

describe('Co2bycountryComponent', () => {
  let component: Co2bycountryComponent;
  let fixture: ComponentFixture<Co2bycountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Co2bycountryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Co2bycountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
