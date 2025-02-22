import { Component, OnInit, Inject, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { loginInterface } from '@autentica/interface/loginInterface';
import { IPropietario } from '@laboratorio/modelos/propietario-modelo';
import { PropietarioService } from '@laboratorio/servicios/propietario.service';
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
];

@Component({
  selector: 'app-elimina-propietario',
  templateUrl: './elimina-propietario.component.html',
  styleUrls: ['./elimina-propietario.component.scss'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EliminaPropietarioComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<EliminaPropietarioComponent>);
  readonly data = inject<IPropietario>(MAT_DIALOG_DATA);

  public propietarioService = inject(PropietarioService);

  dato!: IPropietario;

  constructor() { }

  ngOnInit(): void {
  }

  enviar() {
    /*
    this.dato = {
      _id: this.datoPar._id,
      rutPropietario: this.datoPar.rutPropietario,
      nombres: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      region: '',
      comuna: '',
      direccion: '',
      telefono: '',
      email: '',
      usuarioModifica_id: this.datoPar.usuarioModifica_id
    };
*/
    this.dato.usuarioModifica_id = this.localStorage?.usuarioLogin._id!;
    this.propietarioService.deleteDataPropietario(this.dato)
      .subscribe({
        next: (res) => {
          if (res.codigo === 200) {
            Swal.fire(
              'Se ELIMINÓ con Exito',
              'Click en Boton!',
              'success'
            ),
              this.dialogRef.close(1);
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
