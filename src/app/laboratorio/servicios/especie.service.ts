import { inject, Injectable } from '@angular/core';

import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { IEspecie } from '@laboratorio/modelos/especie-modelo';
import { environment } from '@envs/environment';

@Injectable({
  providedIn: 'root',
})
export class EspecieService {
  private _http = inject(HttpClient);
  constructor() {}

  // POST
  postDataEspecie(dato: any): Observable<any> {
    return this._http
      .post<IEspecie>(`${environment.apiUrl}/especie`, dato)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // PUT
  putDataEspecie(dato: any, nombreEspecieAnterior: string): Observable<any> {
    console.log('id:', dato._id);
    return this._http
      .put<IEspecie>(
        `${environment.apiUrl}/especie/${dato._id}/${nombreEspecieAnterior}`,
        dato
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  deleteDataEspecie(dato: any): Observable<any> {
    console.log('id:', dato._id);
    return this._http
      .delete<IEspecie>(
        `${environment.apiUrl}/especie/${dato._id}/${dato.usuarioModifica_id}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataEspecieTodo(empresaId: string): Observable<any> {
    console.log('paso especie todo');
    return this._http
      .get(`${environment.apiUrl}/especieTodo/${empresaId}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataEmpresaTodo(): Observable<any> {
    console.log(
      'dirección:',
      `${environment.apiUrl}/empresaTodo`
      ///  this.headers
    );
    return this._http
      .get(`${environment.apiUrl}/empresaTodo/`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  errorHandl(error: HttpErrorResponse) {
    console.log('paso error: ', error);
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
