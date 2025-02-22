import { inject, Injectable } from '@angular/core';
import { loginInterface } from './../autentica/interface/loginInterface';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class EstadoService {
  //  Sesion : loginInterface | undefined;
  private _storageService = inject(StorageService);

  loginOut() {
    console.log('Sesion autentica salir');
    this._storageService.remueve('sesion');
  }

  getSesion(): loginInterface | null {
    let currentSesion: loginInterface | null = null;
    //  console.log('currentSesion:', currentSesion);
    const maybeSesion = this._storageService.get<loginInterface>('sesion');

    // console.log('sesion:', maybeSesion);

    if (maybeSesion != null) {
      if (this._isvalidSesion(maybeSesion)) {
        currentSesion = maybeSesion;
      } else {
        //    console.log('sesion invalida');
        this.loginOut();
      }
    }
    return currentSesion;
  }

  private _isvalidSesion(maybeSesion: unknown): boolean {
    return (
      typeof maybeSesion === 'object' &&
      maybeSesion !== null &&
      'usuarioLogin' in maybeSesion
    );
  }
}
