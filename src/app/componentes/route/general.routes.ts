import { Routes } from '@angular/router';
import { privadoGuard } from '@shared/guard/guard.service';

export default [
  /*  {
    path: '',
    canActivate: [privadoGuard()],
    loadComponent: () =>
      import('../../veterinaria/componentes/portada/portada.component'),
  },
*/
  {
    path: 'laboratorio',
    canActivate: [privadoGuard()],
    loadChildren: () => import('../../laboratorio/route/laboratorio.routes'),
    //loadComponent: () => import('./componentes/portada/portada.component'),
  },
] as Routes;
