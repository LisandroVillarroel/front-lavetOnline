import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaFlujoCajaComponent } from './modifica-flujo-caja.component';

describe('ModificaFlujoCajaComponent', () => {
  let component: ModificaFlujoCajaComponent;
  let fixture: ComponentFixture<ModificaFlujoCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificaFlujoCajaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificaFlujoCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
