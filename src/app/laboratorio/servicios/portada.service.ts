import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IportadaRegistro } from '@laboratorio/interfaces/portadaRegistro-interface';
import { environment } from '@envs/environment';
import { catchError, Observable, retry, throwError } from 'rxjs';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class PortadaService {
  private _http = inject(HttpClient);
  /*
  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: this.authenticationService.getToken()!
  });
*/
  getTotalxEstadosLab(empresaId: string): Observable<any> {
    return this._http
      .get<IportadaRegistro>(
        `${environment.apiUrl}/rescataTotalxEstadoLab/${empresaId}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getTotalxEstadosCli(idCliente: string): Observable<any> {
    return this._http
      .get(`${environment.apiUrl}/rescataTotalxEstadoCli/${idCliente}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  errorHandl(error: HttpErrorResponse) {
    console.log('paso error portada: ', error);
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
