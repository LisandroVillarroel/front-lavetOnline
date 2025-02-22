import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { IExamen } from '@laboratorio/modelos/examen-modelo';

const MATERIAL_MODELO = [MatDialogModule, MatButtonModule];

@Component({
  selector: 'app-formato9',
  templateUrl: './formato9.component.html',
  styleUrls: ['./formato9.component.scss'],
  imports: [MATERIAL_MODELO],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Formato9Component {
  readonly dialogRef = inject(MatDialogRef<Formato9Component>);
  readonly data = inject<IExamen>(MAT_DIALOG_DATA);

  constructor() {
    // console.log("examenFisico:",data.formato.formato2.examenFisico);
  }
}
