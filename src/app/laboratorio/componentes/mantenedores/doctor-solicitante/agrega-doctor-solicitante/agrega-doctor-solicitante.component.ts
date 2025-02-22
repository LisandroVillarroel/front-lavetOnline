import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { loginInterface } from '@autentica/interface/loginInterface';
import { ICliente } from '@laboratorio/modelos/cliente-modelo';
import {
  ICliente_,
  IDoctorSolicitante,
} from '@laboratorio/modelos/doctorSolicitante-modelo';
import { ClienteService } from '@laboratorio/servicios/cliente.service';
import { DoctorSolicitanteService } from '@laboratorio/servicios/doctor-solicitante.service';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { StorageService } from '@shared/storage.service';
import Swal from 'sweetalert2';

const MATERIAL_MODELO = [
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
  MatSelectModule,
];

@Component({
  selector: 'app-agrega-doctor-solicitante',
  templateUrl: './agrega-doctor-solicitante.component.html',
  styleUrls: ['./agrega-doctor-solicitante.component.scss'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgregaDoctorSolicitanteComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  private doctorSolicitanteService = inject(DoctorSolicitanteService);
  private clienteService = inject(ClienteService);

  readonly dialogRef = inject(MatDialogRef<AgregaDoctorSolicitanteComponent>);

  datoDoctorSolicitante!: IDoctorSolicitante;
  cliente!: ICliente_;
  public datoCliente = signal<ICliente[]>([]);

  constructor() {}

  nombre = new FormControl('', [Validators.required]);
  idCliente = new FormControl('', [Validators.required]);

  agregaDoctorSolicitante = signal<FormGroup>(
    new FormGroup({
      nombre: this.nombre,
      idCliente: this.idCliente,
    })
  );

  getErrorMessage(campo: string) {
    if (campo === 'nombre') {
      return this.nombre.hasError('required') ? 'Debes ingresar Nombre' : '';
    }

    if (campo === 'idCliente') {
      return this.idCliente.hasError('required')
        ? 'Debes Seleccionar Cliente'
        : '';
    }

    return '';
  }

  async ngOnInit() {
    await this.cargaCliente();
    this.spinnerService.esconder();
  }

  cargaCliente() {
    this.clienteService
      .getDataCliente(
        this.localStorage?.usuarioLogin.empresaConectada.empresa_Id!
      )
      .subscribe({
        next: (res) => {
          console.log('cliente:', res.data);
          this.datoCliente.set(res.data);
        },
        // console.log('yo:', res as PerfilI[]),
        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error, 'error');
        },
      }); // (this.dataSource.data = res as PerfilI[])
  }

  enviar() {
    this.spinnerService.mostrar();
    this.cliente = {
      idCliente: this.agregaDoctorSolicitante().get('idCliente')!.value._id,
      nombreFantasia:
        this.agregaDoctorSolicitante().get('idCliente')!.value.nombreFantasia,
    };

    this.datoDoctorSolicitante = {
      nombre: this.agregaDoctorSolicitante().get('nombre')!.value,
      cliente: this.cliente,
      usuarioCrea_id: this.localStorage?.usuarioLogin._id,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!,
    };

    this.doctorSolicitanteService
      .postDataDoctorSolicitante(this.datoDoctorSolicitante)
      .subscribe({
        next: (res) => {
          this.spinnerService.esconder();
          if (res.codigo === 200) {
            Swal.fire('Se agregó con Éxito', 'Click en Botón!', 'success'); // ,
            this.dialogRef.close(1);
          } else {
            if (res.codigo != 500) {
              Swal.fire(res.mensaje, '', 'error');
            } else {
              Swal.fire('', 'ERROR SISTEMA', 'error');
            }
          }
        },
        error: (error) => {
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error, 'error');
        },
      });
  }
}
