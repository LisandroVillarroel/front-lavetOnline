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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IUnidadMedida } from '@laboratorio/modelos/unidadMedida-modelo';

const MATERIAL_MODELO = [
  MatInputModule,
  MatIconModule,
  MatDialogModule,
  MatButtonModule,
];

@Component({
  selector: 'app-consulta-unidad-medida',
  templateUrl: './consulta-unidad-medida.component.html',
  styleUrls: ['./consulta-unidad-medida.component.scss'],
  imports: [MATERIAL_MODELO],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsultaUnidadMedidaComponent {
  readonly dialogRef = inject(MatDialogRef<ConsultaUnidadMedidaComponent>);
  readonly data = inject<IUnidadMedida>(MAT_DIALOG_DATA);


}
