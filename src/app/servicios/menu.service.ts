import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from '@modelos/menu-modelo';

import {
  BehaviorSubject,
  catchError,
  Observable,
  retry,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  public appDrawer: any;
  public currentUrl = new BehaviorSubject<string>('undefined');

  constructor(private router: Router, private http: HttpClient) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.next(event.urlAfterRedirects);
      }
    });
  }

  headers: HttpHeaders = new HttpHeaders({
    /*  Authorization: this.authenticationService.getToken()*/
  });

  headersPerfil: HttpHeaders = new HttpHeaders({
    'auth-key': 'mJ9NH2gRPf88ziYEtbEzZOIQKW7WpqtzCwLWXONt',
  });

  public closeNav() {
    this.appDrawer.close();
  }

  public openNav() {
    this.appDrawer.open();
  }

  getDataMenu(menu_Id: string): Observable<any> {
    return this.http
      .get<MenuItem>(`${environment.apiUrl}/menu/${menu_Id}`, {
        headers: this.headers,
      })
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataMenuTodo(): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/menuTodo`, { headers: this.headers })
      .pipe(retry(1), catchError(this.errorHandl));
  }

  getDataMenuNombre(menu_nombre: string): Observable<any> {
    return this.http
      .get(`${environment.apiUrl}/menuNombre/${menu_nombre}`, {
        headers: this.headers,
      })
      .pipe(retry(1), catchError(this.errorHandl));
  }

  errorHandl(error: HttpErrorResponse) {
    console.log('paso error menu: ', error);
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
