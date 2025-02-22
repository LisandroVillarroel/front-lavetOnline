import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminaOfertaComponent } from './elimina-oferta.component';

describe('EliminaOfertaComponent', () => {
  let component: EliminaOfertaComponent;
  let fixture: ComponentFixture<EliminaOfertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EliminaOfertaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EliminaOfertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
