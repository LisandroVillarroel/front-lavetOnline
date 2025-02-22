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
import { IDoctorSolicitante } from '@laboratorio/modelos/doctorSolicitante-modelo';
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
];

@Component({
    selector: 'app-elimina-doctor-solicitante',
    templateUrl: './elimina-doctor-solicitante.component.html',
    styleUrls: ['./elimina-doctor-solicitante.component.scss'],
    imports: [MATERIAL_MODELO, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EliminaDoctorSolicitanteComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  public doctorSolicitanteService = inject(DoctorSolicitanteService);

  readonly dialogRef = inject(MatDialogRef<EliminaDoctorSolicitanteComponent>);
  readonly data = inject<IDoctorSolicitante>(MAT_DIALOG_DATA);

  constructor() {}

  ngOnInit() {
    this.spinnerService.esconder();
  }

  enviar() {
    console.log('elimina:', this.data);
    this.doctorSolicitanteService
      .deleteDataDoctorSolicitante(this.data)
      .subscribe({
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
