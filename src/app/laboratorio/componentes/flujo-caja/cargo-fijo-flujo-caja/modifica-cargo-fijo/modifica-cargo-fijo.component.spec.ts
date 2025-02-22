import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaCargoFijoComponent } from './modifica-cargo-fijo.component';

describe('ModificaCargoFijoComponent', () => {
  let component: ModificaCargoFijoComponent;
  let fixture: ComponentFixture<ModificaCargoFijoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificaCargoFijoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificaCargoFijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
