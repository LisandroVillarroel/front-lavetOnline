import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
//import { IConsultaLoginPerfil, IInicio, IMenuLateral } from '@app/interface/inicio';
import { FormControl } from '@angular/forms';
import { LegacyTooltipPosition as TooltipPosition } from '@angular/material/legacy-tooltip';

import { loginInterface } from './../../autentica/interface/loginInterface';

import Swal from 'sweetalert2';

import {
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { StorageService } from '@shared/storage.service';
import { UsuarioService } from '@servicios/usuario.service';
import { MenuItem } from '@modelos/menu-modelo';
import { EmpresaService } from '@laboratorio/servicios/empresa.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MenuListItemComponent } from '@componentes/menu-list-item/menu-list-item.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { AutenticaService } from '@autentica/servicios/autentica.service';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { ClienteService } from '@laboratorio/servicios/cliente.service';


const MATERIAL_MODELO = [
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatSidenavModule,
  MatListModule,
  MatChipsModule,
];

@Component({
  selector: 'app-menu-mat',
  templateUrl: './menu-mat.component.html',
  styleUrls: ['./menu-mat.component.scss'],
  imports: [
    MATERIAL_MODELO,
    RouterModule,
    RouterLink,
    RouterOutlet,
    MenuListItemComponent,
    SpinnerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MenuMatComponent implements OnInit, OnDestroy {
  private _autenticaService = inject(AutenticaService);
  private _storage = inject(StorageService);

  private changeDetectorRef = inject(ChangeDetectorRef);
  private media = inject(MediaMatcher);
  private usuarioService = inject(UsuarioService);
  private empresaService = inject(EmpresaService);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private readonly spinnerService = inject(SpinnerService);

  localStorage = signal(this._storage.get<loginInterface>('sesion'));
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];

  position = new FormControl(this.positionOptions[0]);

  menuItems!: MenuItem[];

  nombreSiglaEmp = signal<string>('');
  nombreTipoEmp = signal<string>('');
  rutaLogo = 'https://storage.cloud.google.com/lavetonline/logo/';
  rutaLogoCliente = 'https://storage.cloud.google.com/lavetonline/logoCliente/';
  nombreLogoEmpresa = 'assets/imagenes/sinLogo.png';

  flag = false;
  accesoDatosEmpresa = signal<boolean>(false);

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor() {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }


  async ngOnInit() {
    this.spinnerService.esconder();
    await this.getDataMenu();
    console.log('usuario Login:', this.localStorage());
    this.nombreTipoEmp.set(
      this.localStorage()!.usuarioLogin.empresaConectada.tipoEmpresa
    );
    this.nombreSiglaEmp.set(
      this.localStorage()!.usuarioLogin.empresaConectada.nombreFantasia
    );

    if (
      this.localStorage()?.usuarioLogin.empresaConectada.tipoEmpresa ==
      'Laboratorio' ||
      this.localStorage()!.usuarioLogin.empresaConectada.tipoEmpresa ==
      'Administrador'
    ) {
      this.getEmpresa(
        this.localStorage()!.usuarioLogin.empresaConectada.empresa_Id
      );
      // this.nombreTipoEmp =this.currentUsuario.usuarioDato.empresaConectada.tipoEmpresa;
    } else {
      this.nombreTipoEmp.set('Veterinaria');
      // this.nombreSiglaEmp= this.currentUsuario.usuarioDato.empresaConectada?.nombreFantasia;
      // this.nombreTipoEmp='Veterinaria';
      this.getCliente(
        this.localStorage()!.usuarioLogin.empresaConectada.empresa_Id
      );
    }
  }
  getEmpresa(idEmpresa: string): any {
    console.log('empresa busca:', idEmpresa);
    this.empresaService.getDataEmpresa(idEmpresa).subscribe({
      next: (res: any) => {
        console.log('empresaaaaaaaaaaaa:', res['data'][0]);
        // this.nombreSiglaEmp= res['data'][0].nombreFantasia;
        console.log('logoooo:', res['data'][0]?.nombreLogo);
        if (
          res['data'][0]?.nombreLogo !== undefined &&
          res['data'][0]?.nombreLogo !== '' &&
          res['data'][0]?.nombreLogo !== 'sinLogo.png'
        ) {
          this.nombreLogoEmpresa = this.rutaLogo + res['data'][0].nombreLogo;
        }
        console.log('logoooo2:', this.nombreLogoEmpresa);
      },
      error: (error: any) => {
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO', error, 'error');
      },
    }); // (this.dataSource.data = res as PerfilI[])
  }

  getCliente(idEmpresa: string): any {
    console.log('empresa busca:', idEmpresa);
    this.clienteService.getDataClienteActual(idEmpresa).subscribe({
      next: (res: any) => {
        if (
          res['data'][0]?.nombreLogo !== undefined &&
          res['data'][0]?.nombreLogo !== '' &&
          res['data'][0]?.nombreLogo !== 'sinLogo.png'
        ) {
          this.nombreLogoEmpresa =
            this.rutaLogoCliente + res['data'][0].nombreLogo;
        }
      },
      error: (error: any) => {
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO', error, 'error');
      },
    }); // (this.dataSource.data = res as PerfilI[])
  }

  getDataMenu() {
    console.log('usuario llama getDataUsuarioId');
    this.usuarioService
      .getDataUsuarioId(this.localStorage()!.usuarioLogin._id)
      .subscribe({
        next: (res: any) => {
          this.menuItems = res.data[0].MenuItem;
          console.log('menu:', res);
          for (const element of this.menuItems) {
            if (
              element.route == 'administrausuario' &&
              element.tipoPermiso == 'Administrador' &&
              element.selected == true
            ) {
              this.accesoDatosEmpresa.set(true);
              console.log('Tipo empresa:', element.tipoPermiso);
            }
          }
          this.flag = true;
        },
        error: (error: any) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error, 'error');
        },
      });
  }

  /*
menuItems: MenuItem[] = [

      {
        displayName: 'Inicio',
        iconName: 'home',
        route: 'inicio',
        disabled: false
      },
      {
        displayName: 'Administra Usuario',
        iconName: 'local_hospital',
        route: 'administraUsuario',
        tipoPermiso:'Administrador',
        disabled: false
      },
      {
        displayName: 'Ingreso Ficha',
        iconName: 'local_hospital',
        route: 'ingresoFicha',
        tipoPermiso:'Administrador', //Basico
        disabled: false
      },
      {
        displayName: 'Ingreso EXAMEN',
        iconName: 'local_hospital',
        route: 'ingresoExamenFicha',
        tipoPermiso:'Administrador', // Basico
        disabled: false
      },
      {
        displayName: 'Consulta EXAMEN',
        iconName: 'local_hospital',
        route: 'consultaExamenFicha',
        tipoPermiso:'Administrador', // Basico
        disabled: false
      },
      {
        displayName: 'Mantenedores',
        iconName: 'list',
        disabled: false,
        children: [
        {
            displayName: 'Cliente',
            iconName: 'forward',
            route: 'mantenedorCliente',
            tipoPermiso:'Administrador',
            disabled: false
        },
        {
          displayName: 'Doctor Solicitante',
          iconName: 'forward',
          route: 'doctorSolicitante',
          tipoPermiso:'Administrador',
          disabled: false
        },
        {
          displayName: 'EXAMEN',
          iconName: 'forward',
          route: 'mantenedorExamen',
          tipoPermiso:'Administrador',
          disabled: false
        },
        {
          displayName: 'Especie',
          iconName: 'forward',
          route: 'mantenedorEspecie',
          tipoPermiso:'Administrador',
          disabled: false
        },
        {
          displayName: 'Raza',
          iconName: 'forward',
          route: 'mantenedorRaza',
          tipoPermiso:'Administrador',
          disabled: false
        },
        {
          displayName: 'Formatos',
          iconName: 'forward',
          route: 'mantenedorFormatos',
          tipoPermiso:'Administrador',
          disabled: false
        }
        ]
      },
      {
        displayName: 'Cerrar',
        iconName: 'exit_to_app',
        route: '',
        disabled: false
      },
    ]
  ;
*/

  shouldRun = true;

  traeTituloModulo(valor: any) {
    // this.tituloModulo = valor;
  }

  getMenu() {
    return this.menuItems.filter((item) => item.selected === true);
  }

  /*
  fillerNav = [
    {name: 'Inicio', route: 'inicio', icon: ''},
    {name: 'Usuarios', route: 'usu', icon: ''},
    {name: 'Cotización', route: 'usu', icon: ''},
    {name: 'Orden de Trabajo', route: 'usu', icon: ''},
    {name: 'Inventario', route: 'inventario', icon: ''},
    {name: 'Factura', route: 'PuntoVenta', icon: ''},
    {name: 'Mantenedores', route: 'usu', icon: ''},
    {name: 'Home', route: 'home', icon: ''}
  ];
*/

  cerrar() {
    // this._storage.remueve('sesion');
    //this.router.navigate(['/login']);

    this._autenticaService.logout();
    this.router.navigate(['/login']);
  }
}
