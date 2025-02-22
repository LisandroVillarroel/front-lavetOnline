import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminaCargoFijoComponent } from './elimina-cargo-fijo.component';

describe('EliminaCargoFijoComponent', () => {
  let component: EliminaCargoFijoComponent;
  let fixture: ComponentFixture<EliminaCargoFijoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EliminaCargoFijoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EliminaCargoFijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
