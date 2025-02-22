import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EstadoService } from '@shared/estado.service';

export const privadoGuard = (): CanActivateFn => {
  return () => {
    const autenticaEstado = inject(EstadoService);
    const router = inject(Router);

    const sesion = autenticaEstado.getSesion();

    if (sesion) return true;

    //router.navigateByUrl('login');
    console.log('sesion guard:', sesion);
    return false;
  };
};

export const publicoGuard = (): CanActivateFn => {
  return () => {
    const autenticaEstado = inject(EstadoService);
    const router = inject(Router);

    const sesion = autenticaEstado.getSesion();
    //console.log('sesion guard:', sesion);
    if (sesion) return true;

    router.navigateByUrl('login');
    return false;
  };
};
