import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@envs/environment';
import { IValidador } from '@laboratorio/modelos/validador-modelo';

import { catchError, Observable, retry, throwError } from 'rxjs';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ValidadorService {
  private _http = inject(HttpClient);

  constructor() {}

  // POST
  postDataValidador(dato: any): Observable<any> {
    return this._http
      .post<IValidador>(`${environment.apiUrl}/validador`, dato)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // PUT
  putDataValidador(dato: any): Observable<any> {
    console.log('id:', dato._id);
    return this._http
      .put<IValidador>(`${environment.apiUrl}/validador/${dato._id}`, dato)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // PUT
  deleteDataValidador(dato: any): Observable<any> {
    console.log('id:', dato._id);
    return this._http
      .delete<IValidador>(
        `${environment.apiUrl}/validador/${dato._id}/${dato.usuarioModifica_id}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataValidadorTodo(empresa_Id: string): Observable<any> {
    return this._http
      .get(`${environment.apiUrl}/validadorTodo/${empresa_Id}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataValidador(id: string): Observable<any> {
    console.log('service empresa:', id);
    return this._http
      .get(`${environment.apiUrl}/validador/${id}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  postDataValidadorArchivo(file: any): Observable<any> {
    // Create form data
    console.log('file:', file);
    const formData = new FormData();

    if (file.nombreArchivo != 'sinFirma.jpg')
      formData.append('file', file.base64textString, file.nombreArchivo);

    return this._http
      .post(`${environment.apiUrl}/subeArchivoValidador`, '')
      .pipe(retry(1), catchError(this.errorHandl));
  }

  errorHandl(error: HttpErrorResponse) {
    console.log(' validador: ', error);
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
