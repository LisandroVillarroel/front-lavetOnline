import {
  Component,
  OnInit,
  Inject,
  inject,
  ChangeDetectionStrategy,
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
import { IClienteInterface } from '@laboratorio/interfaces/cliente-interface';
import { ClienteService } from '@laboratorio/servicios/cliente.service';
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
    selector: 'app-elimina-cliente',
    templateUrl: './elimina-cliente.component.html',
    styleUrls: ['./elimina-cliente.component.scss'],
    imports: [MATERIAL_MODELO, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EliminaClienteComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<EliminaClienteComponent>);
  readonly data = inject<IClienteInterface>(MAT_DIALOG_DATA);

  public servCliente = inject(ClienteService);

  constructor() {}

  ngOnInit(): void {
    this.spinnerService.esconder();
  }

  enviar() {
    this.spinnerService.mostrar();
    this.servCliente
      .deleteDataCliente(
        this.data.datoClientePar._id!,
        this.data.empresa_Id,
        this.data.usuarioModifica_id
      )
      .subscribe({
        next: (dato) => {
          this.spinnerService.esconder();
          if (dato.codigo === 200) {
            Swal.fire('Se ELIMINÓ con Éxito', 'Click en Boton!', 'success'),
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
