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
import { ICliente } from '@laboratorio/modelos/cliente-modelo';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private _http = inject(HttpClient);
  constructor() {}
  /*
  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: this.authenticationService.getToken()!
  });

  header = {
    headers: new HttpHeaders()
      .set('Authorization', this.authenticationService.getToken()!)
  }
      */
  // getDataPerfil() {
  //  return this.perfilServ;
  // }

  // POST
  postDataCliente(dato: ICliente): Observable<any> {
    return this._http
      .post<ICliente>(`${environment.apiUrl}/cliente`, dato)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // PUT
  putDataCliente(dato: ICliente): Observable<any> {
    console.log('id:', dato._id);
    return this._http
      .put<ICliente>(`${environment.apiUrl}/cliente/${dato._id}`, dato)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // PUT
  deleteDataCliente(
    id: string,
    empresa_Id: string,
    usuarioModifica_id: string
  ): Observable<any> {
    return this._http
      .put<ICliente>(
        `${environment.apiUrl}/cliente/${id}/${empresa_Id}/${usuarioModifica_id}`,
        ''
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataClientePorRut(rutCliente: string): Observable<any> {
    return this._http
      .get(`${environment.apiUrl}/buscaClientePorRut/${rutCliente}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataEmpresasCliente(id: string): Observable<any> {
    return this._http
      .get(`${environment.apiUrl}/buscarEmpresasCliente/${id}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataClienteActual(id: string): Observable<any> {
    return this._http
      .get(`${environment.apiUrl}/cliente/${id}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataCliente(empresaId: string): Observable<any> {
    return this._http
      .get(`${environment.apiUrl}/clienteTodo/${empresaId}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  postDataClienteArchivo(file: any): Observable<any> {
    // Create form data
    console.log('file:', file);
    const formData = new FormData();

    if (file.nombreArchivo != 'sinLogo.png')
      formData.append('file', file.base64textString, file.nombreArchivo);

    return this._http
      .post(`${environment.apiUrl}/subeArchivoCliente`, formData)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  errorHandl(error: HttpErrorResponse) {
    console.log('paso error cliente: ', error);
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
