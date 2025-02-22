import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaTransaccionComponent } from './modifica-transaccion.component';

describe('ModificaTransaccionComponent', () => {
  let component: ModificaTransaccionComponent;
  let fixture: ComponentFixture<ModificaTransaccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificaTransaccionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificaTransaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
