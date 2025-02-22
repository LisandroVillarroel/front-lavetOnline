import { inject, Injectable } from '@angular/core';

import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { environment } from '@envs/environment';
import { IUnidadMedida } from '@laboratorio/modelos/unidadMedida-modelo';

@Injectable({
  providedIn: 'root',
})
export class UnidadMedidaService {
  private _http = inject(HttpClient);

  // POST
  postDataUnidadMedida(dato: any): Observable<any> {
    return this._http
      .post<IUnidadMedida>(`${environment.apiUrl}/unidadMedida`, dato)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // PUT
  putDataUnidadMedida(dato: any, nombreUnidadMedidaAnterior: string): Observable<any> {
    console.log('id:', dato._id);
    return this._http
      .put<IUnidadMedida>(
        `${environment.apiUrl}/unidadMedida/${dato._id}/${nombreUnidadMedidaAnterior}`,
        dato
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  deleteDataUnidadMedida(dato: any): Observable<any> {
    return this._http
      .delete<IUnidadMedida>(
        `${environment.apiUrl}/unidadMedida/${dato._id}/${dato.usuarioModifica_id}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataUnidadMedidaTodo(empresaId: string): Observable<any> {
    ;
    return this._http
      .get(`${environment.apiUrl}/unidadMedidaTodo/${empresaId}`)
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
