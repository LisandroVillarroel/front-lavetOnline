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
  selector: 'app-formato4',
  templateUrl: './formato4.component.html',
  styleUrls: ['./formato4.component.scss'],
  imports: [MATERIAL_MODELO],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Formato4Component {
  readonly dialogRef = inject(MatDialogRef<Formato4Component>);
  readonly data = inject<IExamen>(MAT_DIALOG_DATA);

  constructor() {
    // console.log("examenFisico:",data.formato.formato2.examenFisico);
  }
}
