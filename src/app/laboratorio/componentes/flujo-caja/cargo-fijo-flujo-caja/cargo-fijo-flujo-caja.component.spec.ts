import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoFijoFlujoCajaComponent } from './cargo-fijo-flujo-caja.component';

describe('CargoFijoFlujoCajaComponent', () => {
  let component: CargoFijoFlujoCajaComponent;
  let fixture: ComponentFixture<CargoFijoFlujoCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargoFijoFlujoCajaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargoFijoFlujoCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
