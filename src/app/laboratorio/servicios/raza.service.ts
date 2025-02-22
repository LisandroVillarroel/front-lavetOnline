import { inject, Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { IRaza } from '@laboratorio/modelos/raza-modelo';
import { environment } from '@envs/environment';

@Injectable({
  providedIn: 'root',
})
export class RazaService {
  private _http = inject(HttpClient);

  constructor() {}

  // POST
  postDataRaza(dato: any): Observable<any> {
    return this._http
      .post<IRaza>(`${environment.apiUrl}/raza`, dato)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // POST
  postDataRazaMasiva(dato: IRaza[]): Observable<any> {
    return this._http
      .post<IRaza[]>(`${environment.apiUrl}/razaMasiva`, dato)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // PUT
  putDataRaza(dato: any): Observable<any> {
    console.log('id:', dato._id);
    return this._http
      .put<IRaza>(`${environment.apiUrl}/raza/${dato._id}`, dato)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  deleteDataRaza(dato: any): Observable<any> {
    console.log('id:', dato._id);
    return this._http
      .delete<IRaza>(
        `${environment.apiUrl}/raza/${dato._id}/${dato.usuarioModifica_id}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataRazaTodo(empresaId: string): Observable<any> {
    return this._http
      .get(`${environment.apiUrl}/razaTodo/${empresaId}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataRazaTodoEspecie(
    empresaId: string,
    nombreEspecie: string
  ): Observable<any> {
    return this._http
      .get(`${environment.apiUrl}/razaTodo/${empresaId}/${nombreEspecie}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  errorHandl(error: HttpErrorResponse) {
    console.log('paso error raza: ', error);
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log('mio: ', errorMessage);
    Swal.fire('ERROR INESPERADO', errorMessage, 'error');
    return throwError(errorMessage);
  }
}
