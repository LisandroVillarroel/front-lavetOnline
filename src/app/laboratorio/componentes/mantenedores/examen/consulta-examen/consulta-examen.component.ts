import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IExamen } from '@laboratorio/modelos/examen-modelo';

const MATERIAL_MODELO = [
  MatInputModule,
  MatIconModule,
  MatDialogModule,
  MatButtonModule,
];

@Component({
  selector: 'app-consulta-examen',
  templateUrl: './consulta-examen.component.html',
  styleUrls: ['./consulta-examen.component.scss'],
  imports: [MATERIAL_MODELO],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsultaExamenComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ConsultaExamenComponent>);
  readonly data = inject<IExamen>(MAT_DIALOG_DATA);

  // imagen = './assets/imagenes/';

  constructor() {}

  ngOnInit() {
    // this.imagen=this.imagen+ this.currentUsuario.usuarioDato.empresa.rutEmpresa+'/'+this.data.nombreExamen  // agregar a estructura data.nomreArchivo
  }
}
