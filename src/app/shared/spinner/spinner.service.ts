import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SpinnerService {
  isCargando = signal<boolean>(true);
  public esconder() {
    this.isCargando.set(false);
  }

  public mostrar() {
    this.isCargando.set(true);
  }
}
