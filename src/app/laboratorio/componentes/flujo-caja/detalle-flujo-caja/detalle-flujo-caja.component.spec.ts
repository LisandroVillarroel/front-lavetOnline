import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleFlujoCajaComponent } from './detalle-flujo-caja.component';

describe('DetalleFlujoCajaComponent', () => {
  let component: DetalleFlujoCajaComponent;
  let fixture: ComponentFixture<DetalleFlujoCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleFlujoCajaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleFlujoCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
