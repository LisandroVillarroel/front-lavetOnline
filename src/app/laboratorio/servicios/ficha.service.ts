import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IFicha } from '@laboratorio/modelos/ficha-modelo';
import { environment } from '@envs/environment';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class FichaService {
  //constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }
  private _http = inject(HttpClient);
  /*headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: this.authenticationService.getToken()!
  });

   header = {
    headers: new HttpHeaders()
      .set('Authorization', this.authenticationService.getToken()!)
  }
*/
  // POST
  postDataFicha(dato: IFicha): Observable<any> {
    console.log('envia agregar ficha:', dato);
    return this._http
      .post<IFicha>(`${environment.apiUrl}/ficha`, dato)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // PUT
  putDataFicha(dato: IFicha): Observable<any> {
    console.log('id:', dato.fichaC.id_Ficha);
    return this._http
      .put<IFicha>(
        `${environment.apiUrl}/fichaModifica/${dato.fichaC.id_Ficha}`,
        dato
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  putDataFichaAnaliza(dato: any): Observable<any> {
    console.log('id:', dato._id);
    return this._http
      .put<IFicha>(`${environment.apiUrl}/fichaAnaliza/${dato._id}`, dato)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  //Modifica Estado
  getDataFichaRecepcionaNumeroFicha(
    numeroFicha: string,
    empresa_Id: string,
    usuario: string
  ): Observable<any> {
    return this._http
      .get(
        `${environment.apiUrl}/fichaRecepcionaNumeroFicha/${empresa_Id}/${numeroFicha}/${usuario}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  //Modifica Estado
  getDataFichaRecepcionaIdFicha(
    id_Ficha: string,
    empresa_Id: string,
    usuario: string
  ): Observable<any> {
    return this._http
      .get(
        `${environment.apiUrl}/fichaRecepcionaIdFicha/${empresa_Id}/${id_Ficha}/${usuario}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  // Delete
  deleteDataFicha(_id: string, usuario: string): Observable<any> {
    return this._http
      .delete<IFicha>(`${environment.apiUrl}/ficha/${_id}/${usuario}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataFichaUnica(id: string): Observable<any> {
    return this._http
      .get(`${environment.apiUrl}/ficha/${id}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataFichaIdFicha(
    empresaOrigen: string,
    id_Ficha: string
  ): Observable<any> {
    return this._http
      .get(`${environment.apiUrl}/fichaIdFicha/${empresaOrigen}/${id_Ficha}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataFichaXIdFicha(
    empresaOrigen: string,
    estadoFicha: string,
    tipoPermiso: string,
    idUsuarioAsignado: string
  ): Observable<any> {
    console.log('estodo ficha:', estadoFicha);
    return this._http
      .get(
        `${environment.apiUrl}/getDataFichaXIdFicha/${empresaOrigen}/${estadoFicha}/${tipoPermiso}/${idUsuarioAsignado}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataFichaDetalle(
    empresaOrigen: string,
    id_Ficha: string
  ): Observable<any> {
    return this._http
      .get(
        `${environment.apiUrl}/getDataFichaDetalle/${empresaOrigen}/${id_Ficha}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataFicha(
    empresaOrigen: string,
    estadoFicha: string,
    usuario: string,
    tipoPermiso: string,
    idUsuarioAsignado: string
  ): Observable<any> {
    return this._http
      .get(
        `${environment.apiUrl}/fichaTodo/${empresaOrigen}/${estadoFicha}/${usuario}/${tipoPermiso}/${idUsuarioAsignado}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataFichaPorFecha(
    empresaOrigen: string,
    estadoFicha: string,
    usuario: string,
    fechaInicio: string,
    fechaFin: string,
    tipoPermiso: string,
    idUsuarioAsignado: string
  ): Observable<any> {
    return this._http
      .get(
        `${environment.apiUrl}/fichaTodoPorFecha/${empresaOrigen}/${estadoFicha}/${usuario}/${fechaInicio}/${fechaFin}/${tipoPermiso}/${idUsuarioAsignado}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataFichaVet(
    empresaOrigen: string,
    estadoFicha: string,
    usuario: string
  ): Observable<any> {
    return this._http
      .get(
        `${environment.apiUrl}/fichaTodoVet/${empresaOrigen}/${estadoFicha}/${usuario}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataFichaPorFechaVet(
    empresaOrigen: string,
    estadoFicha: string,
    usuario: string,
    fechaInicio: number,
    fechaFin: number
  ): Observable<any> {
    return this._http
      .get(
        `${environment.apiUrl}/fichaTodoPorFechaVet/${empresaOrigen}/${estadoFicha}/${usuario}/${fechaInicio}/${fechaFin}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  /*
  upload(file:any,nombreArchivo: string,ficha_Id:string):Observable<any> {
    console.log('nombre Archivo:',nombreArchivo);
    console.log('Blob File:',file);
    // Create form data
    const formData = new FormData();

    // Store form name as "file" with file data
    formData.append("file", file, nombreArchivo);

    //return this.http.post(`${environment.apiUrl}/fichaSubeArchivo/${empresa_Id}/${directorio}/${nombreExamen}/${numFicha}/${ficha_Id}`, formData, this.header)
    return this.http.post(`${environment.apiUrl}/fichaSubeArchivo/${ficha_Id}`, formData, this.header)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }
*/
  /*
  envioCorreo(ficha_Id:string):Observable<any> {
    return this.http.post(`${environment.apiUrl}/fichaSubeArchivo/${ficha_Id}`, { headers: this.headers })
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }
*/
  pruebaSendgrid(): Observable<any> {
    return this._http
      .post(`${environment.apiUrl}/pruebaSendgrid`, '')
      .pipe(retry(1), catchError(this.errorHandl));
  }
  /*
  envioCorreoClienteFinal(ficha_Id:string):Observable<any> {
    return this.http.post(`${environment.apiUrl}/envioExamenCorreoClienteFinal/${ficha_Id}`, { headers: this.headers })
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }
*/
  envioCorreoSolicitudCliente(id: string): Observable<any> {
    return this._http
      .post(`${environment.apiUrl}/envioCorreoSolicitudCliente/${id}`, '')
      .pipe(retry(1), catchError(this.errorHandl));
  }

  postDownLoadFile(file: string) {
    var body = { filename: file };
    console.log('nombre:', body);
    return this._http.post(`${environment.apiUrl}/fichaDescargaArchivo`, body, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    });
  }

  getDataPaciente(runPropietario: string): Observable<any> {
    return this._http
      .get(`${environment.apiUrl}/paciente/${runPropietario}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataFichaEnvioCorreo(empresaOrigen: string): Observable<any> {
    return this._http
      .get(`${environment.apiUrl}/armaConsultaXfichaParaEnvio/${empresaOrigen}`)
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataDetalleXfichaParaEnvio(
    empresaOrigen: string,
    id_Ficha: string
  ): Observable<any> {
    console.log('empresa:' + empresaOrigen + ' ficha:' + id_Ficha);
    return this._http
      .get(
        `${environment.apiUrl}/detalleXfichaParaEnvio/${empresaOrigen}/${id_Ficha}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataDetalleXfichaParaEnvioCliente(
    empresaOrigen: string,
    id_Ficha: string
  ): Observable<any> {
    console.log('empresa:' + empresaOrigen + ' ficha:' + id_Ficha);
    return this._http
      .get(
        `${environment.apiUrl}/detalleXfichaParaEnvioCliente/${empresaOrigen}/${id_Ficha}`
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  envioCorreoTodosExamen(
    file: any,
    rutEmpresaDirectorio: string,
    id_Ficha: string,
    empresaOrigen: string,
    usuario: string,
    correoCliente: string
  ): Observable<any> {
    // Create form data
    const formData = new FormData();
    for (let a = 0; a < file.length; a++) {
      // Store form name as "file" with file data
      formData.append('file', file[a].archivo, file[a].nombre);
    }

    return this._http
      .post(
        `${environment.apiUrl}/envioCorreoTodosExamen/${rutEmpresaDirectorio}/${id_Ficha}/${empresaOrigen}/${usuario}/${correoCliente}`,
        formData
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  envioCorreoTodosExamenCliente(
    file: any,
    id_Ficha: string,
    numeroFicha_Arr: string,
    empresaOrigen: string,
    usuario: string,
    correoClienteFinal: string
  ): Observable<any> {
    // numeroFicha_Arr si va palabra TODOS es masivo si tiene dato es seleccionado
    // Create form data
    const formData = new FormData();
    for (let a = 0; a < file.length; a++) {
      // Store form name as "file" with file data
      formData.append('file', file[a].archivo, file[a].nombre);
    }

    return this._http
      .post(
        `${environment.apiUrl}/envioCorreoTodosExamenCliente/${id_Ficha}/${numeroFicha_Arr}/${empresaOrigen}/${usuario}/${correoClienteFinal}`,
        formData
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  envioCorreoUnicoExamenes(
    file: any,
    _id: string,
    internoExterno: string,
    numeroFicha: string,
    empresaOrigen: string,
    usuario: string,
    correoCliente: string
  ): Observable<any> {
    // Create form data
    console.log('file:', file);
    const formData = new FormData();
    for (let a = 0; a < file.length; a++) {
      // Store form name as "file" with file data
      formData.append('file', file[a].archivo, file[a].nombre);
    }

    return this._http
      .post(
        `${environment.apiUrl}/envioCorreoUnicoExamenes/${_id}/${internoExterno}/${numeroFicha}/${empresaOrigen}/${usuario}/${correoCliente}`,
        formData
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  subePdfExamenExterno(
    file: any,
    _id: string,
    id_Ficha: string,
    nombreArchivoPdf: string,
    rutEmpresaDirectorio: string,
    numeroFicha: string,
    empresaOrigen: string,
    usuario: string
  ): Observable<any> {
    // Create form data
    const formData = new FormData();
    formData.append('file', file, nombreArchivoPdf);
    // Store form name as "file" with file data

    return this._http
      .post(
        `${environment.apiUrl}/subePdfExamenExterno/${_id}/${rutEmpresaDirectorio}/${id_Ficha}/${numeroFicha}/${empresaOrigen}/${usuario}`,
        formData
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }

  postDownLoadImagen(file: string) {
    var body = { filename: file };
    console.log('nombre:', body);
    return this._http.post(`${environment.apiUrl}/fichaDescargaImagen`, body, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    });
  }

  postDownLoadImagenFirma(file: string) {
    var body = { filename: file };
    console.log('nombre:', body);
    return this._http.post(
      `${environment.apiUrl}/fichaDescargaImagenFirma`,
      body,
      {
        responseType: 'blob',
        headers: new HttpHeaders().append('Content-Type', 'application/json'),
      }
    );
  }

  errorHandl(error: HttpErrorResponse) {
    console.log('paso error ficha: ', error);
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
