import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { environment } from '@envs/environment';
import { IExamen } from '@laboratorio/modelos/examen-modelo';
import { IFormato1 } from '@laboratorio/modelos/examenes/examenFormato1';

@Injectable({
  providedIn: 'root',
})
export class ExamenService {
  private _http = inject(HttpClient);

  // POST
  postDataExamen(dato: any): Observable<any> {
    return this._http
      .post<IExamen>(`${environment.apiUrl}/examen`, dato)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // PUT
  putDataExamen(dato: any): Observable<any> {
    console.log('id:', dato._id);
    return this._http
      .put<IExamen>(`${environment.apiUrl}/examen/${dato._id}`, dato)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // PUT
  deleteDataExamen(dato: any): Observable<any> {
    console.log('id:', dato._id);
    return this._http
      .delete<IExamen>(
        `${environment.apiUrl}/examen/${dato._id}/${dato.usuarioModifica_id}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataExamen(Id: string): Observable<any> {
    return this._http
      .get(`${environment.apiUrl}/examen/${Id}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataExamenTodo(empresaId: string): Observable<any> {
    return this._http
      .get(`${environment.apiUrl}/examenTodo/${empresaId}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataExamenTodoNoSiExiste(
    empresaId: string,
    idEmpresaLaboratorio: string
  ): Observable<any> {
    return this._http
      .get(
        `${environment.apiUrl}/getDataExamenTodoNoSiExiste/${empresaId}/${idEmpresaLaboratorio}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataExamenEstructura(
    empresaId: string,
    codigoInterno: string,
    especiesId: string
  ): Observable<any> {
    return this._http
      .get<IFormato1>(
        `${environment.apiUrl}/examenEstructuraFormato1/${empresaId}/${codigoInterno}/${especiesId}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  errorHandl(error: HttpErrorResponse) {
    console.log(' exámenes: ', error);
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
