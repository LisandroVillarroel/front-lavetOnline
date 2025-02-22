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
import { IExamen } from '@laboratorio/modelos/examen-modelo';
import { ExamenService } from '@laboratorio/servicios/examen.service';
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
  selector: 'app-elimina-examen',
  templateUrl: './elimina-examen.component.html',
  styleUrls: ['./elimina-examen.component.scss'],
  imports: [MATERIAL_MODELO, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EliminaExamenComponent implements OnInit {
  private _storage = inject(StorageService);
  private localStorage = this._storage.get<loginInterface>('sesion');
  private readonly spinnerService = inject(SpinnerService);

  readonly dialogRef = inject(MatDialogRef<EliminaExamenComponent>);
  readonly data = inject<IExamen>(MAT_DIALOG_DATA);

  private servicioService = inject(ExamenService);
  datoExamen!: IExamen;
  //imagen = './assets/imagenes/';

  constructor() {}

  ngOnInit(): void {
    this.datoExamen = this.data;
    this.datoExamen.usuarioModifica_id = this.localStorage?.usuarioLogin._id!;
    //  this.imagen=this.imagen+ this.currentUsuario.usuarioDato.empresa.rutEmpresa+'/'+this.data.nombreExamen  // agregar a estructura data.nomreArchivo
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

    this.servicioService.deleteDataExamen(this.datoExamen).subscribe(
      (dato) => {
        console.log('respuesta:', dato['codigo']);
        if (dato['codigo'] === 200) {
          Swal.fire('Se ELIMINÓ con Exito', 'Click en Boton!', 'success'),
            this.dialogRef.close(1);
        } else {
          console.log('error', dato);
        }
      }
      // error =>{console.log('error agrega:',<any>error);this.errorMsg=error.error.error;alert('Error: ' + this.errorMsg)}
    );
  }
}
