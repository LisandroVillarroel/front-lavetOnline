import {
  Component, OnInit, ChangeDetectionStrategy, inject, signal,
} from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTreeModule } from '@angular/material/tree';
import { loginInterface } from '@autentica/interface/loginInterface';
import { IEspecie } from '@laboratorio/modelos/especie-modelo';
import { IRaza } from '@laboratorio/modelos/raza-modelo';
import { EspecieService } from '@laboratorio/servicios/especie.service';
import { RazaService } from '@laboratorio/servicios/raza.service';
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
];

@Component({
  selector: 'app-modifica-raza',
  templateUrl: './modifica-raza.component.html',
  styleUrls: ['./modifica-raza.component.scss'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModificaRazaComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<ModificaRazaComponent>);
  readonly data = inject<IRaza>(MAT_DIALOG_DATA);

  private especieService = inject(EspecieService);
  private razaService = inject(RazaService);

  datoRaza!: IRaza;
  datoEspecie = signal<IEspecie[]>([]);
  constructor() { }

  idEspecie = new FormControl(this.data.especieNombre, [Validators.required]);
  nombre = new FormControl(this.data.nombre, [Validators.required]);

  modificaRaza = signal<FormGroup>(
    new FormGroup({
      idEspecie: this.idEspecie,
      nombre: this.nombre,
    })
  );

  getErrorMessage(campo: any) {
    if (campo === 'nombre') {
      return this.nombre.hasError('required') ? 'Debes ingresar Nombre' : '';
    }

    return '';
  }

  async ngOnInit() {
    this.spinnerService.mostrar();
    await this.cargaEspecie(this.data);
    this.spinnerService.esconder();
  }

  cargaEspecie(dataRaza: IRaza) {
    console.log('data raza:', dataRaza);
    this.especieService.getDataEspecieTodo(dataRaza.empresa_Id!).subscribe({
      next: (res) => {
        console.log('especie:', res.data);
        this.datoEspecie.set(res.data);
      },
      error: (error) => {
        console.log('error carga:', error);
        Swal.fire('ERROR INESPERADO', error, 'error');
      },
    });
  }

  enviar() {
    this.spinnerService.mostrar();
    console.log('especieeee:', this.modificaRaza().get('idEspecie')!.value);
    let especieNombre_: string;
    if (this.modificaRaza().get('idEspecie')!.value._id == undefined) {
      especieNombre_ = this.data.especieNombre;
    } else {
      especieNombre_ = this.modificaRaza().get('idEspecie')!.value.nombre;
    }

    this.datoRaza = {
      _id: this.data._id,
      especieNombre: especieNombre_,
      nombre: this.modificaRaza().get('nombre')!.value,
      usuarioModifica_id: this.data.usuarioModifica_id,
    };
    console.log('modifica:', this.datoRaza);
    this.razaService.putDataRaza(this.datoRaza).subscribe({
      next: (dato) => {
        this.spinnerService.esconder();
        if (dato.codigo === 200) {
          Swal.fire('Ya se grabó con Éxito', 'Click en Botón!', 'success'),
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

  // Error handlin

  comparaSeleccionaEspecie(v1: any, v2: any): boolean {
    console.log('v1:', v1.nombre);
    console.log('v2:', v2);
    return v1.nombre === v2;
  }
}
