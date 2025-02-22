import { Routes } from '@angular/router';
import { privadoGuard } from '@shared/guard/guard.service';

export default [
  {
    path: 'portada',
    canActivate: [privadoGuard()],
    loadComponent: () =>
      import('@laboratorio/componentes/portada/portada.component'),
  },
  {
    path: 'actualizaDatosEmpresa',
    canActivate: [privadoGuard()],
    loadComponent: () =>
      import(
        '@laboratorio/componentes/perfil-empresa/perfil-empresa.component'
      ),
  },
  {
    path: 'ingresoFicha',
    canActivate: [privadoGuard()],
    loadComponent: () =>
      import('@laboratorio/componentes/fichaExamen/ficha/ficha.component'),
  },
  {
    path: 'analisisExamenFicha',
    canActivate: [privadoGuard()],
    loadComponent: () =>
      import(
        '@laboratorio/componentes/fichaExamen/analisis-examen/examen-ficha.component'
      ),
  },
  {
    path: 'gestion/ventas',
    canActivate: [privadoGuard()],
    loadComponent: () =>
      import(
        '@laboratorio/componentes/gestion/dash-panel-ventas/dash-panel-ventas.component'
      ),
  },
  //MANTENEDORES
  {
    path: 'mantenedores/cliente',
    canActivate: [privadoGuard()],
    loadComponent: () =>
      import('@laboratorio/componentes/mantenedores/cliente/cliente.component'),
  },
  {
    path: 'mantenedores/doctorSolicitante',
    canActivate: [privadoGuard()],
    loadComponent: () =>
      import(
        '@laboratorio/componentes/mantenedores/doctor-solicitante/doctor-solicitante.component'
      ),
  },
  {
    path: 'mantenedores/especie',
    canActivate: [privadoGuard()],
    loadComponent: () =>
      import('@laboratorio/componentes/mantenedores/especie/especie.component'),
  },
  {
    path: 'mantenedores/raza',
    canActivate: [privadoGuard()],
    loadComponent: () =>
      import('@laboratorio/componentes/mantenedores/raza/raza.component'),
  },
  {
    path: 'mantenedores/validadores',
    canActivate: [privadoGuard()],
    loadComponent: () =>
      import(
        '@laboratorio/componentes/mantenedores/validadores/validadores.component'
      ),
  },
  {
    path: 'mantenedores/mantenedorofertas',
    canActivate: [privadoGuard()],
    loadComponent: () =>
      import('@laboratorio/componentes/mantenedores/oferta/oferta.component'),
  },
  {
    path: 'mantenedores/categoriaExamen',
    canActivate: [privadoGuard()],
    loadComponent: () =>
      import(
        '@laboratorio/componentes/mantenedores/categoriaExamen/categoria-examen.component'
      ),
  },
  {
    path: 'mantenedores/examen',
    canActivate: [privadoGuard()],
    loadComponent: () =>
      import('@laboratorio/componentes/mantenedores/examen/examen.component'),
  },
  {
    path: 'mantenedores/unidadMedida',
    canActivate: [privadoGuard()],
    loadComponent: () =>
      import(
        '@laboratorio/componentes/mantenedores/unidad-medida/unidad-medida.component'
      ),
  },
  {
    path: '**',
    redirectTo: 'portada',
  },
] as Routes;
