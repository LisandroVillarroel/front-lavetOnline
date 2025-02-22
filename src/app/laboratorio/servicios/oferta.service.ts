import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@envs/environment';
import { IOferta } from '@laboratorio/modelos/oferta-model';
import { catchError, Observable, retry, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class OfertaService {
  private _http = inject(HttpClient);
  // POST
  postDataOfert(dato: IOferta): Observable<any> {
    return this._http
      .post<IOferta>(`${environment.apiUrl}/oferta`, dato)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // PUT
  putDataOferta(dato: IOferta): Observable<any> {
    console.log('id:', dato._id);
    return this._http
      .put<IOferta>(`${environment.apiUrl}/oferta/${dato._id}`, dato)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // PUT
  deleteDataOferta(id: string, usuarioModifica_id: string): Observable<any> {
    return this._http
      .put<IOferta>(
        `${environment.apiUrl}/oferta/${id}/${usuarioModifica_id}`,
        ''
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataOfertaActual(id: string): Observable<any> {
    return this._http
      .get(`${environment.apiUrl}/oferta/${id}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataOfertaTodo(empresaId: string): Observable<any> {
    return this._http
      .get(`${environment.apiUrl}/ofertaTodo/${empresaId}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  errorHandl(error: HttpErrorResponse) {
    console.log(' oferta: ', error);
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
