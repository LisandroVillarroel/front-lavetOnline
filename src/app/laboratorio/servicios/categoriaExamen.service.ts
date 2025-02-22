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

import { environment } from '@envs/environment';
import { ICategoriaExamen } from '@laboratorio/modelos/categoriaExamen-modelo';

@Injectable({
  providedIn: 'root',
})
export class CategoriaExamenService {
  private _http = inject(HttpClient);
  constructor() {}

  // POST
  postDataCategoriaExamen(dato: any): Observable<any> {
    return this._http
      .post<ICategoriaExamen>(`${environment.apiUrl}/categoriaExamen`, dato)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // PUT
  putDataCategoriaExamen(dato: any): Observable<any> {
    console.log('id:', dato._id);
    return this._http
      .put<ICategoriaExamen>(
        `${environment.apiUrl}/categoriaExamen/${dato._id}`,
        dato
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  deleteDataCategoriaExamen(dato: any): Observable<any> {
    console.log('id:', dato._id);
    return this._http
      .delete<ICategoriaExamen>(
        `${environment.apiUrl}/categoriaExamen/${dato._id}/${dato.usuarioModifica_id}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataCategoriaExamenTodo(empresaId: string): Observable<any> {
    console.log('paso categoria todo');
    return this._http
      .get(`${environment.apiUrl}/categoriaExamenTodo/${empresaId}`)
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
