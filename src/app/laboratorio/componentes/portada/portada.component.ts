import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { StorageService } from '@shared/storage.service';

import Swal from 'sweetalert2';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { PortadaService } from '@laboratorio/servicios/portada.service';
import { loginInterface } from '@autentica/interface/loginInterface';

const MATERIAL_MODELO = [
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatListModule,
  MatCardModule,
];

@Component({
  selector: 'app-portada',
  templateUrl: './portada.component.html',
  styleUrls: ['./portada.component.scss'],
  imports: [MATERIAL_MODELO, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PortadaComponent {
  private readonly portadaService = inject(PortadaService);

  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  fechaActual = new Date();

  total = signal({
    Enviado: 0,
    Ingresado: 0,
    Solicitado: 0,
    Analizado: 0,
    Recepcionado: 0,
  });

  totalCliente = {
    Solicitado: 0,
    Recepcionado: 0,
    Recibido: 0,
  };

  nombreSiglaEmp: string = '';
  imagenCabeceraLabVet: string = '';
  pendientes: number = 0;

  ngOnInit() {
    console.log('currentUsuario:', this.localStorage);
    this.nombreSiglaEmp !=
      this.localStorage?.usuarioLogin.empresaConectada.nombreFantasia;

    this.imagenCabeceraLabVet = './assets/imagenes/iconos/icono2.png';
    this.getEstadosLab();
  }

  getEstadosLab() {
    this.portadaService
      .getTotalxEstadosLab(
        this.localStorage!.usuarioLogin.empresaConectada.empresa_Id
      )
      .subscribe({
        next: (res: any) => {
          console.log('res:', res);
          console.log('res data:', res.data);
          this.total.set(res.data);
          this.pendientes = this.total().Ingresado + this.total().Recepcionado;
        },
        // console.log('yo:', res as PerfilI[]),
        error: (error: any) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error, 'error');
        },
      }); // (this.dataSource.data = res as PerfilI[])
  }
}
