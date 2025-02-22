import { Routes } from '@angular/router';
import { privadoGuard } from '@shared/guard/guard.service';

export const routes: Routes = [
  {
    path: 'login',
    //canActivate: [publicoGuard()],
    //loadChildren: () => import('./componentes/route/laboratorio.routes'),
    // loadChildren: () => import('./autentica/route/auten.routes'),
    loadComponent: () =>
      import('./autentica/componentes/login/login.component'),
  },

  {
    path: 'actualizaDatos',
    canActivate: [privadoGuard()],
    loadComponent: () =>
      import(
        './componentes/datosPersonales/actualiza-datos/actualiza-datos.component'
      ),
  },

  {
    path: 'cambioContrasena',
    canActivate: [privadoGuard()],
    loadComponent: () =>
      import(
        './componentes/datosPersonales/cambio-contrasena/cambio-contrasena.component'
      ),
  },

  {
    path: 'administrausuario',
    canActivate: [privadoGuard()],
    loadComponent: () =>
      import('./componentes/perfiles-usuario/perfiles-usuario.component'),
  },

  {
    path: 'laboratorio',
    canActivate: [privadoGuard()],
    loadChildren: () => import('./laboratorio/route/laboratorio.routes'),
    //loadComponent: () => import('./componentes/portada/portada.component'),
  },
  /*
  {
    path: 'veterinaria',
    canActivate: [privadoGuard()],
    loadChildren: () => import('./veterinaria/route/veterinaria.routes'),
    //loadComponent: () => import('./componentes/portada/portada.component'),
  },
  */
  {
    path: '**',
    redirectTo: 'login',
  },
];
