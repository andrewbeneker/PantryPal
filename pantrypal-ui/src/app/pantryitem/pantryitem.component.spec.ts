import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantryitemComponent } from './pantryitem.component';

describe('PantryitemComponent', () => {
  let component: PantryitemComponent;
  let fixture: ComponentFixture<PantryitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PantryitemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantryitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
