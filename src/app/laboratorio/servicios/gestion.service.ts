import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@envs/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class GestionService {
  private _http = inject(HttpClient);
  constructor() {}

  getDataGestionGeneral(
    ano: string,
    mes: string,
    idLaboratorio: string,
    idClienteVet: string
  ): Observable<any> {
    console.log('ano:', ano);
    console.log('mes:', mes);
    console.log('mes:', idLaboratorio);
    console.log('mes:', idClienteVet);
    return this._http
      .get(
        `${environment.apiUrl}/generalVentas/${ano}/${mes}/${idLaboratorio}/${idClienteVet}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataComparaVentasAnoAnterior(
    ano: string,
    mes: string,
    idLaboratorio: string,
    idClienteVet: string
  ): Observable<any> {
    return this._http
      .get(
        `${environment.apiUrl}/ComparaVentasAnoAnterior/${ano}/${mes}/${idLaboratorio}/${idClienteVet}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getVentaExamen(
    ano: string,
    mes: string,
    idLaboratorio: string,
    idClienteVet: string
  ): Observable<any> {
    return this._http
      .get(
        `${environment.apiUrl}/ventasPorExamen/${ano}/${mes}/${idLaboratorio}/${idClienteVet}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getVentaDia(
    ano: string,
    mes: string,
    idLaboratorio: string,
    idClienteVet: string
  ): Observable<any> {
    return this._http
      .get(
        `${environment.apiUrl}/ventasPorDia/${ano}/${mes}/${idLaboratorio}/${idClienteVet}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  ventasPorCliente(
    ano: string,
    mes: string,
    idLaboratorio: string,
    idClienteVet: string
  ): Observable<any> {
    return this._http
      .get(
        `${environment.apiUrl}/ventasPorCliente/${ano}/${mes}/${idLaboratorio}/${idClienteVet}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  errorHandl(error: HttpErrorResponse) {
    console.log('paso error gestion: ', error);
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
