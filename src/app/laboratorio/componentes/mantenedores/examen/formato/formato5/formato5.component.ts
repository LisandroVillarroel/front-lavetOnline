import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { IExamen } from '@laboratorio/modelos/examen-modelo';

const MATERIAL_MODELO = [MatDialogModule, MatButtonModule];

@Component({
  selector: 'app-formato5',
  templateUrl: './formato5.component.html',
  styleUrls: ['./formato5.component.scss'],
  imports: [MATERIAL_MODELO],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Formato5Component {
  readonly dialogRef = inject(MatDialogRef<Formato5Component>);
  readonly data = inject<IExamen>(MAT_DIALOG_DATA);

  constructor() {
    // console.log("examenFisico:",data.formato.formato2.examenFisico);
  }
}
