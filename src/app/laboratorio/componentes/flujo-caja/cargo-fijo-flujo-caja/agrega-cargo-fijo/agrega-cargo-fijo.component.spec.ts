import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregaCargoFijoComponent } from './agrega-cargo-fijo.component';

describe('AgregaCargoFijoComponent', () => {
  let component: AgregaCargoFijoComponent;
  let fixture: ComponentFixture<AgregaCargoFijoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregaCargoFijoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregaCargoFijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
