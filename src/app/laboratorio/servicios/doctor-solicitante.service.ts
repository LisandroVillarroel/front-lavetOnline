import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { IDoctorSolicitante } from '@laboratorio/modelos/doctorSolicitante-modelo';
import { environment } from '@envs/environment';

@Injectable({
  providedIn: 'root',
})
export class DoctorSolicitanteService {
  private _http = inject(HttpClient);

  // POST
  postDataDoctorSolicitante(dato: any): Observable<any> {
    return this._http
      .post<any>(`${environment.apiUrl}/doctorSolicitante`, dato)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // PUT
  putDataDoctorSolicitante(dato: any): Observable<any> {
    console.log('id:', dato._id);
    return this._http
      .put<IDoctorSolicitante>(
        `${environment.apiUrl}/doctorSolicitante/${dato._id}`,
        dato
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  deleteDataDoctorSolicitante(dato: any): Observable<any> {
    console.log('id:', dato._id);
    return this._http
      .delete<IDoctorSolicitante>(
        `${environment.apiUrl}/doctorSolicitante/${dato._id}/${dato.usuarioModifica_id}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataClienteDoctorSolicitante(idCliente: string): Observable<any> {
    console.log('id cliente doctor solicitante', idCliente);
    return this._http
      .get(`${environment.apiUrl}/doctorSolicitanteCliente/${idCliente}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataDoctorSolicitante(empresaId: string): Observable<any> {
    return this._http
      .get(`${environment.apiUrl}/doctorSolicitanteTodo/${empresaId}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  errorHandl(error: HttpErrorResponse) {
    console.log('paso error doctor: ', error);
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
