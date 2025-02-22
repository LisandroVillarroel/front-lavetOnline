import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@envs/environment';
import { IEmpresa } from '@modelos/empresa-modelo';

import { catchError, Observable, retry, throwError } from 'rxjs';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private _http = inject(HttpClient);
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
  // POST
  postDataEmpresa(dato: any): Observable<any> {
    return this._http
      .post<IEmpresa>(`${environment.apiUrl}/empresa`, JSON.stringify(dato))
      .pipe(retry(1), catchError(this.errorHandl));
  }

  postDataEmpresaArchivo(
    file: any,
    idEmpresa: string,
    rutEmpresa: string
  ): Observable<any> {
    // Create form data
    console.log('file:', file);
    const formData = new FormData();
    for (let a = 0; a < file.length; a++) {
      if (file[a].nombreArchivo != 'sinLogo.png')
        formData.append(
          'file',
          file[a].base64textString,
          file[a].nombreArchivo
        );
    }

    return this._http
      .post(
        `${environment.apiUrl}/subeArchivoEmpresa/${idEmpresa}/${rutEmpresa}`,
        formData
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }
  // PUT
  putDataEmpresa(dato: any): Observable<any> {
    console.log('id:', dato._id);
    return this._http
      .put<IEmpresa>(`${environment.apiUrl}/empresa/${dato._id}`, dato)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // PUT
  deleteDataEmpresa(dato: any): Observable<any> {
    console.log('id:', dato._id);
    return this._http
      .delete<IEmpresa>(
        `${environment.apiUrl}/empresa/${dato._id}/${dato.usuarioModifica_id}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataEmpresaTodoListado(listaEmp: string): Observable<any> {
    console.log(
      'dirección:',
      `${environment.apiUrl}/empresaListado/${listaEmp}`
    );
    return this._http
      .get(`${environment.apiUrl}/empresaListado/${listaEmp}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataEmpresaTodo(): Observable<any> {
    console.log('dirección:', `${environment.apiUrl}/empresaTodo`);
    return this._http
      .get(`${environment.apiUrl}/empresaTodo/`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataEmpresa(id: string): Observable<any> {
    console.log('service empresa:', id);
    return this._http
      .get(`${environment.apiUrl}/empresa/${id}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  errorHandl(error: HttpErrorResponse) {
    console.log('paso erro empresar: ', error);
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
