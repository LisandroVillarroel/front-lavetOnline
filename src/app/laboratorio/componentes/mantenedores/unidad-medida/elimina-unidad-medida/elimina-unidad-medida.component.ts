import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { loginInterface } from '@autentica/interface/loginInterface';
import { IUnidadMedida } from '@laboratorio/modelos/unidadMedida-modelo';
import { UnidadMedidaService } from '@laboratorio/servicios/unidad-medida.service';
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
  selector: 'app-elimina-Unidad-Medida',
  templateUrl: './elimina-Unidad-Medida.component.html',
  styleUrls: ['./elimina-unidad-medida.component.scss'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EliminaUnidadMedidaComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<EliminaUnidadMedidaComponent>);
  readonly data = inject<IUnidadMedida>(MAT_DIALOG_DATA);

  private unidadMedidaService = inject(UnidadMedidaService);
  private datoUnidadMedida!: IUnidadMedida;
  constructor() { }

  ngOnInit() {
    this.spinnerService.mostrar();
    this.datoUnidadMedida = this.data;
    this.spinnerService.esconder();
  }

  enviar() {
    this.spinnerService.mostrar();
    this.datoUnidadMedida.usuarioModifica_id = this.localStorage?.usuarioLogin._id!;
    this.unidadMedidaService.deleteDataUnidadMedida(this.datoUnidadMedida).subscribe({
      next: (dato) => {
        this.spinnerService.esconder();
        if (dato.codigo === 200) {
          Swal.fire('Se ELIMINÓ con Éxito', 'Click en Botón!', 'success'),
            this.dialogRef.close(1);
        } else {
          console.log('error', dato);
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
