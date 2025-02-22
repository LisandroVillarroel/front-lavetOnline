import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@envs/environment';
import { catchError, Observable, retry, throwError } from 'rxjs';
import Swal from 'sweetalert2';



@Injectable({
  providedIn: 'root'
})
export class FlujoCajaService {

  private _http = inject(HttpClient);

  // POST
  postDataFlujoCaja(dato: any): Observable<any> {
    return this._http.post(`${environment.apiUrl}/agregaFlujoCaja`, JSON.stringify(dato))
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  getDataConsultaTotalCuentaMes(empresaId: string, fecha: string): Observable<any> {

    return this._http.get(`${environment.apiUrl}/consultaTotalCuentaMes/${empresaId}/${fecha}`)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
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
    Swal.fire(
      'ERROR INESPERADO',
      errorMessage,
      'error'
    );
    return throwError(errorMessage);
  }

}
