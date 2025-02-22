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
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTreeModule } from '@angular/material/tree';
import { loginInterface } from '@autentica/interface/loginInterface';
import {
  ICliente_,
  IDoctorSolicitante,
} from '@laboratorio/modelos/doctorSolicitante-modelo';
import { DoctorSolicitanteService } from '@laboratorio/servicios/doctor-solicitante.service';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { StorageService } from '@shared/storage.service';

import Swal from 'sweetalert2';

const MATERIAL_MODELO = [
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatIconModule,
  MatDialogModule,
  MatButtonModule,
  MatTreeModule,
  MatCheckboxModule,
  MatSelectModule,
  MatStepperModule,
];

@Component({
    selector: 'app-modifica-doctor-solicitante',
    templateUrl: './modifica-doctor-solicitante.component.html',
    styleUrls: ['./modifica-doctor-solicitante.component.scss'],
    imports: [MATERIAL_MODELO, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModificaDoctorSolicitanteComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<ModificaDoctorSolicitanteComponent>);
  readonly data = inject<IDoctorSolicitante>(MAT_DIALOG_DATA);

  private doctorSolicitanteService = inject(DoctorSolicitanteService);
  //private clienteService= inject(ClienteService);

  private datoDoctorSolicitante!: IDoctorSolicitante;
  private cliente!: ICliente_;
  //private datoCliente!: ICliente[];

  constructor() {}
  nombre = new FormControl(this.data.nombre, [Validators.required]);
  //   idCliente = new FormControl(this.data.cliente.idCliente, [Validators.required]);

  modificaDoctorSolicitante = signal<FormGroup>(
    new FormGroup({
      nombre: this.nombre,
      //    idCliente: this.idCliente
    })
  );

  getErrorMessage(campo: string) {
    if (campo === 'nombre') {
      return this.nombre.hasError('required') ? 'Debes ingresar Nombre' : '';
    }

    /*     if (campo === 'idCliente'){
        return this.idCliente.hasError('required') ? 'Debes Seleccionar Cliente' : '';
      }
*/
    return '';
  }

  ngOnInit() {
    this.spinnerService.esconder();
  }
  /*

    cargaCliente(){
      this.clienteService
      .getDataCliente(this.data.empresa_Id)
      .subscribe(res => {
        console.log('cliente:', res['data'])
        this.datoCliente = res['data'] ;
        for(let a=0; a<this.datoCliente.length; a++){
          // for(let b=0; b<this.datoClienteEmpresa[a].empresa!.length; b++){

            //  if (this.datoClienteEmpresa![a].empresa![a].empresa_Id != this.currentUsuario.usuarioDato.empresa.empresa_Id){
              this.datoCliente![a].empresa = this.datoCliente![a].empresa!.filter(x=> x.empresa_Id === this.data.empresa_Id)
            //  }
           // }
         }
      },
      // console.log('yo:', res as PerfilI[]),
      error => {
        console.log('error carga:', error);
       Swal.fire(
        'ERROR INESPERADO',
        error,
       'error'
      );
      }
    ); // (this.dataSource.data = res as PerfilI[])
    }
*/
  enviar() {
    this.spinnerService.mostrar();
    console.log(
      'this.modificaDoctorSolicitante.get(idCliente)!.value',
      this.modificaDoctorSolicitante()
    );
    this.cliente = {
      idCliente: this.data.cliente.idCliente,
      nombreFantasia: this.data.cliente.nombreFantasia,
    };

    this.datoDoctorSolicitante = {
      _id: this.data._id,
      nombre: this.modificaDoctorSolicitante().get('nombre')!.value,
      cliente: this.cliente,
      usuarioModifica_id: this.data.usuarioModifica_id,
    };
    console.log('modifica:', this.datoDoctorSolicitante);
    this.doctorSolicitanteService
      .putDataDoctorSolicitante(this.datoDoctorSolicitante)
      .subscribe({
        next: (dato) => {
          this.spinnerService.esconder();
          if (dato.codigo === 200) {
            Swal.fire('Ya se grabó con Éxito', 'Click en Botón!', 'success'),
              this.dialogRef.close(1);
          } else {
            if (dato.codigo != 500) {
              Swal.fire(dato.mensaje, '', 'error');
            } else {
              console.log('Error Doctor Solicitante:', dato);
              Swal.fire('', 'ERROR SISTEMA', 'error');
            }
          }
        },
        error: (error) => {
          this.spinnerService.esconder();
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error.error.error, 'error');
        },
      });
  }

  comparaSelecciona(v1: any, v2: any): boolean {
    return compareFn(v1, v2);
  }
}

function compareFn(v1: any, v2: any): boolean {
  return v1 && v2 ? v1.value === v2.value : v1 === v2;
}
