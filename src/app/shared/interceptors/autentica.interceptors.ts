import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { EstadoService } from '@shared/estado.service';
import { catchError, throwError } from 'rxjs';

export const autenticaInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const estadoService = inject(EstadoService);
  const routes = inject(Router);
  const token = estadoService.getSesion()?.usuarioLogin.accessToken;

  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(request).pipe(
    catchError((error) => {
      //  console.log('error autentica:', error);
      if (error instanceof HttpErrorResponse && error.status === 401) {
        console.log('error autentica:', error);
        estadoService.loginOut();
        routes.navigateByUrl('/');
        location.reload();
      }
      return throwError(() => error);
    })
  );
};
