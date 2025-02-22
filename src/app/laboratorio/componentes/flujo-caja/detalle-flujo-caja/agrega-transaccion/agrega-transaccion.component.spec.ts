import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregaTransaccionComponent } from './agrega-transaccion.component';

describe('AgregaTransaccionComponent', () => {
  let component: AgregaTransaccionComponent;
  let fixture: ComponentFixture<AgregaTransaccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregaTransaccionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregaTransaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
