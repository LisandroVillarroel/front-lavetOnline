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
  selector: 'app-formato1',
  templateUrl: './formato1.component.html',
  styleUrls: ['./formato1.component.scss'],
  imports: [MATERIAL_MODELO],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Formato1Component {
  readonly dialogRef = inject(MatDialogRef<Formato1Component>);
  readonly data = inject<IExamen>(MAT_DIALOG_DATA);

  constructor() {}
}
