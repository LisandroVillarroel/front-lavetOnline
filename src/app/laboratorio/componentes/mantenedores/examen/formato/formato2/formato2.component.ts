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
  selector: 'app-formato2',
  templateUrl: './formato2.component.html',
  styleUrls: ['./formato2.component.scss'],
  imports: [MATERIAL_MODELO],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Formato2Component {
  readonly dialogRef = inject(MatDialogRef<Formato2Component>);
  readonly data = inject<IExamen>(MAT_DIALOG_DATA);

  constructor() {}
}
