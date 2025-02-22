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
import { IUsuario, IUsuarioContrasena } from '@modelos/usuario-modelo';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private _http = inject(HttpClient);
  /*
  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: this.authenticationService.getToken()!
  });

  headers2: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });
*/
  // getDataPerfil() {
  //  return this.perfilServ;
  // }
  postDataUsuario(dato: any): Observable<any> {
    console.log('paso usuario post');
    return this._http
      .post<IUsuario>(`${environment.apiUrl}/usuario`, dato)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // PUT
  putDataUsuario(dato: IUsuario): Observable<any> {
    console.log('paso usuario put');
    console.log('id:', dato._id);
    return this._http
      .put<IUsuario>(`${environment.apiUrl}/usuario/${dato._id}`, dato)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // PUT
  putDataUsuarioContrasena(dato: any): Observable<any> {
    console.log('paso usuario put contraseña');
    console.log('id:', dato._id);
    return this._http
      .put<IUsuario>(
        `${environment.apiUrl}/usuarioContrasena/${dato._id}`,
        dato
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // PUT
  putDataUsuarioContrasenaReset(dato: any): Observable<any> {
    console.log('id:', dato._id);
    console.log('paso usuario reset');
    return this._http
      .put<IUsuarioContrasena>(
        `${environment.apiUrl}/usuarioContrasenaReset/${dato._id}`,
        dato
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataUsuarioId(Id: string): Observable<any> {
    console.log('paso usuario get usuarioId', environment.apiUrl);
    console.log('paso usuario Id:', Id);
    // console.log('paso http',this.headers)
    return this._http
      .get(`${environment.apiUrl}/usuario/${Id}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataUsuario(empresaId: string, tipoEmpresa: string): Observable<any> {
    console.log('paso usuario get usuario', environment.apiUrl);
    return this._http
      .get(`${environment.apiUrl}/usuarioTodo/${empresaId}/${tipoEmpresa}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataUsuarioLaboratorio(empresaId: string): Observable<any> {
    console.log('paso usuario get usuario laboratorio');
    return this._http
      .get(`${environment.apiUrl}/usuarioTodoLaboratorio/${empresaId}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataUsuarioTodo(): Observable<any> {
    console.log('paso usuario get todo');
    return this._http
      .get(`${environment.apiUrl}/usuarioTodo`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataUsuarioIdPermiso(Id: string, route: string): Observable<any> {
    console.log('paso usuario get usuario permiso');
    return this._http
      .get(`${environment.apiUrl}/usuarioPermiso/${Id}/${route}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  errorHandl(error: HttpErrorResponse) {
    console.log('paso error usuario: ', error.error);
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log('mio: ', errorMessage);
    Swal.fire('ERROR INESPERADOOOO', errorMessage, 'error');
    return throwError(errorMessage);
  }
}
