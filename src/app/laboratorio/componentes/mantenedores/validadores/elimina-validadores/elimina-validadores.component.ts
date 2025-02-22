import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { loginInterface } from '@autentica/interface/loginInterface';
import { IValidador } from '@laboratorio/modelos/validador-modelo';
import { ValidadorService } from '@laboratorio/servicios/validador.service';
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
  MatCardModule,
];

@Component({
    selector: 'app-elimina-validadores',
    templateUrl: './elimina-validadores.component.html',
    styleUrls: ['./elimina-validadores.component.scss'],
    imports: [MATERIAL_MODELO, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EliminaValidadoresComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<EliminaValidadoresComponent>);
  readonly data = inject<IValidador>(MAT_DIALOG_DATA);

  private validadorService = inject(ValidadorService);
  datoValidador!: IValidador;

  imagen = 'https://storage.cloud.google.com/lavetonline/firma/';
  load: boolean = false;

  constructor() {}

  ngOnInit() {
    if (
      this.data?.nombreFirma == undefined ||
      this.data?.nombreFirma == '' ||
      this.data?.nombreFirma == 'sinFirma.jpg'
    ) {
      this.imagen = this.imagen + 'sinFirma.jpg';
    } else {
      this.imagen = this.imagen + this.data?.nombreFirma; // agregar a estructura data.nomreArchivo
    }
  }

  enviar() {
    this.datoValidador = this.datoValidador;
    this.datoValidador.usuarioModifica_id =
      this.localStorage?.usuarioLogin._id!;

    this.validadorService.deleteDataValidador(this.datoValidador).subscribe(
      (dato) => {
        console.log('respuesta:', dato['codigo']);
        if (dato['codigo'] === 200) {
          Swal.fire('Se ELIMINÓ con Éxito', '', 'success'),
            this.dialogRef.close(1);
        } else {
          console.log('error', dato);
        }
      }
      // error =>{console.log('error agrega:',<any>error);this.errorMsg=error.error.error;alert('Error: ' + this.errorMsg)}
    );
  }
}
