import {
  Component,
  OnInit,
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
import { loginInterface } from '@autentica/interface/loginInterface';
import { ICategoriaExamen } from '@laboratorio/modelos/categoriaExamen-modelo';
import { CategoriaExamenService } from '@laboratorio/servicios/categoriaExamen.service';
import { SpinnerService } from '@shared/spinner/spinner.service';
import { StorageService } from '@shared/storage.service';

import Swal from 'sweetalert2';

const MATERIAL_MODELO = [
  MatFormFieldModule,
  ReactiveFormsModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
];

@Component({
  selector: 'app-agrega-categoria-examen',
  templateUrl: './agrega-categoria-examen.component.html',
  styleUrls: ['./agrega-categoria-examen.component.scss'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgregaCategoriaExamenComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<AgregaCategoriaExamenComponent>);

  private categoriaExamenService = inject(CategoriaExamenService);

  datoCategoriaExamen!: ICategoriaExamen;

  constructor() {}

  nombre = new FormControl('', [Validators.required]);
  sigla = new FormControl('', [Validators.required]);

  agregaCategoriaExamen = signal<FormGroup>(
    new FormGroup({
      nombre: this.nombre,
      sigla: this.sigla,
    })
  );

  getErrorMessage(campo: string) {
    if (campo === 'nombre') {
      return this.nombre.hasError('required') ? 'Debes ingresar Nombre' : '';
    }

    if (campo === 'sigla') {
      return this.sigla.hasError('required') ? 'Debes ingresar Sigla' : '';
    }
    return '';
  }

  ngOnInit() {
    this.spinnerService.esconder();
  }

  enviar() {
    this.spinnerService.mostrar();
    this.datoCategoriaExamen = {
      nombre: this.agregaCategoriaExamen().get('nombre')!.value,
      sigla: this.agregaCategoriaExamen().get('sigla')!.value,
      usuarioCrea_id: this.localStorage?.usuarioLogin._id,
      usuarioModifica_id: this.localStorage?.usuarioLogin._id!,
      empresa_Id: this.localStorage?.usuarioLogin.empresaConectada.empresa_Id,
    };

    this.categoriaExamenService
      .postDataCategoriaExamen(this.datoCategoriaExamen)
      .subscribe({
        next: (dato) => {
          console.log('respuesta:', dato);
          console.log('respuesta:', dato.mensaje);
          this.spinnerService.esconder();
          if (dato.codigo === 200) {
            Swal.fire('Se agregó con Éxito', '', 'success'); // ,
            this.dialogRef.close(1);
          } else {
            if (dato.codigo != 500) {
              Swal.fire(dato.mensaje, '', 'error');
            } else {
              console.log('Error CategoriaExamen:', dato);
              Swal.fire('', 'ERROR SISTEMA', 'error');
            }
          }
        },
        error: (error) => {
          this.spinnerService.esconder();
          console.log('error carga:', error);
          Swal.fire('ERROR INESPERADO', error, 'error');
        },
      });
  }
}
