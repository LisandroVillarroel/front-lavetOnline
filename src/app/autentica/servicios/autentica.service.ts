import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@envs/environment';
import { StorageService } from '@shared/storage.service';
import { loginInterface } from '@autentica/interface/loginInterface';
@Injectable({
  providedIn: 'root',
})
export class AutenticaService {
  private _http = inject(HttpClient);
  private _storage = inject(StorageService);

  login(user: loginInterface): Observable<loginInterface> {
    console.log('paso1.1 Login', environment.apiUrl);
    return this._http
      .post<loginInterface>(`${environment.apiUrl}/login`, user)
      .pipe(
        tap((res: loginInterface) => {
          console.log('paso1.2 Login', res);
          if (res) {
            console.log('res:', res);
            this._storage.set('sesion', res);
          }
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    //  this.token = '';
    this._storage.remueve('sesion');
    sessionStorage.clear();
    location.reload();
    //  this.currentUsuarioSubject.next(null as any);
  }
}
