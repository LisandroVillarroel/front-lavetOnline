import { Routes } from '@angular/router';
import { publicoGuard } from '@shared/guard/guard.service';
export default [
  {
    path: '',
    //canActivate: [publicoGuard()],
    loadComponent: () => import('./../componentes/login/login.component'),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
] as Routes;
