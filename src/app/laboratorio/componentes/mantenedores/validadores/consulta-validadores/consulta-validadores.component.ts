import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

const MATERIAL_MODELO = [
  MatInputModule,
  MatIconModule,
  MatDialogModule,
  MatButtonModule,
  MatCardModule,
];

@Component({
    selector: 'app-consulta-validadores',
    templateUrl: './consulta-validadores.component.html',
    styleUrls: ['./consulta-validadores.component.scss'],
    imports: [MATERIAL_MODELO],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsultaValidadoresComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ConsultaValidadoresComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  imagen = 'https://storage.cloud.google.com/lavetonline/firma/';

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
}
