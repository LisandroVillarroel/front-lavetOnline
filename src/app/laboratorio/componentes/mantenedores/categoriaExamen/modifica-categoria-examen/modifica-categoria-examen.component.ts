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
import { ICategoriaExamen } from '@laboratorio/modelos/categoriaExamen-modelo';
import { CategoriaExamenService } from '@laboratorio/servicios/categoriaExamen.service';
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
  selector: 'app-modifica-categoria-examen',
  templateUrl: './modifica-categoria-examen.component.html',
  styleUrls: ['./modifica-categoria-examen.component.scss'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModificaCategoriaExamenComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<ModificaCategoriaExamenComponent>);
  readonly data = inject<ICategoriaExamen>(MAT_DIALOG_DATA);

  private categoriaExamenService = inject(CategoriaExamenService);

  _dato!: ICategoriaExamen;

  constructor() {
    console.log('data modifica categoria', this.data);
  }

  nombre = new FormControl(this.data.nombre, [Validators.required]);
  sigla = new FormControl(this.data.sigla, [Validators.required]);

  modificaCategoriaExamen = signal<FormGroup>(
    new FormGroup({
      nombre: this.nombre,
      sigla: this.sigla,
    })
  );

  getErrorMessage(campo: any) {
    if (campo === 'nombre') {
      return this.nombre.hasError('required') ? 'Debes ingresar Nombre' : '';
    }
    if (campo === 'sigla') {
      return this.sigla.hasError('required') ? 'Debes ingresar Sigla' : '';
    }
    return '';
  }

  ngOnInit() {}

  enviar() {
    this.spinnerService.mostrar();
    this._dato = {
      _id: this.data._id,
      nombre: this.modificaCategoriaExamen().get('nombre')!.value,
      sigla: this.modificaCategoriaExamen().get('sigla')!.value,
      usuarioModifica_id: this.data.usuarioModifica_id,
    };
    console.log('modifica:', this._dato);
    this.categoriaExamenService.putDataCategoriaExamen(this._dato).subscribe({
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
