import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { IPropietario } from '@laboratorio/modelos/propietario-modelo';
import { environment } from '@envs/environment';

@Injectable({
  providedIn: 'root'
})

export class PropietarioService {
  private _http = inject(HttpClient);

  constructor() { }


  // POST
  postDataPropietario(dato: any): Observable<any> {
    return this._http.post<IPropietario>(`${environment.apiUrl}/propietario`, JSON.stringify(dato))
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  // PUT
  putDataPropietario(dato: any): Observable<any> {
    console.log('id:', dato._id);
    return this._http.put<IPropietario>(`${environment.apiUrl}/propietario/${dato._id}`, JSON.stringify(dato))
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  // PUT
  deleteDataPropietario(dato: any): Observable<any> {
    console.log('id:', dato._id);
    return this._http.delete<IPropietario>(`${environment.apiUrl}/propietario/${dato._id}/${dato.usuarioModifica_id}`)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  getDataPropietario(): Observable<any> {
    return this._http.get(`${environment.apiUrl}/propietarioTodo`)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  getDataPropietarioRut(rutPropietario: string): Observable<any> {
    return this._http.get(`${environment.apiUrl}/propietarioRut/${rutPropietario}`)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  errorHandl(error: HttpErrorResponse) {
    console.log('paso error propietario: ', error);
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log('mio: ', errorMessage);
    Swal.fire(
      'ERROR INESPERADO',
      errorMessage,
      'error'
    );
    return throwError(errorMessage);
  }

}
