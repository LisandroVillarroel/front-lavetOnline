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
import { IEspecie } from '@laboratorio/modelos/especie-modelo';
import { EspecieService } from '@laboratorio/servicios/especie.service';
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
    selector: 'app-modifica-especie',
    templateUrl: './modifica-especie.component.html',
    styleUrls: ['./modifica-especie.component.scss'],
    imports: [MATERIAL_MODELO, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModificaEspecieComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<ModificaEspecieComponent>);
  readonly data = inject<IEspecie>(MAT_DIALOG_DATA);

  private especieService = inject(EspecieService);

  _dato!: IEspecie;

  constructor() {}
  nombre = new FormControl(this.data.nombre, [Validators.required]);

  modificaEspecie = signal<FormGroup>(
    new FormGroup({
      nombre: this.nombre,
    })
  );

  getErrorMessage(campo: any) {
    if (campo === 'nombre') {
      return this.nombre.hasError('required') ? 'Debes ingresar Nombre' : '';
    }

    return '';
  }

  ngOnInit() {}

  enviar() {
    this.spinnerService.mostrar();
    this._dato = {
      _id: this.data._id,
      nombre: this.modificaEspecie().get('nombre')!.value,
      usuarioModifica_id: this.data.usuarioModifica_id,
    };
    console.log('modifica:', this._dato);
    this.especieService.putDataEspecie(this._dato, this.data.nombre).subscribe({
      next: (dato) => {
        console.log('dato:', dato);
        this.spinnerService.esconder();
        if (dato.codigo === 200) {
          Swal.fire('Se grabó con Éxito', 'Click en Botón!', 'success'),
            this.dialogRef.close(1);
        } else {
          Swal.fire(dato.mensaje, 'Click en Botón!', 'error');
        }
      },
      error: (error) => {
        this.spinnerService.esconder();
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO', error.error.error, 'error');
      },
    });
  }
}
