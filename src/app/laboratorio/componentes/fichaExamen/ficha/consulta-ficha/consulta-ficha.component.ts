import { ChangeDetectionStrategy, Component, inject, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

const MATERIAL_MODELO = [
  MatInputModule,
  MatIconModule,
  MatDialogModule,
  MatButtonModule,
  MatDividerModule
];
@Component({
  selector: 'app-consulta-ficha',
  templateUrl: './consulta-ficha.component.html',
  styleUrls: ['./consulta-ficha.component.scss'],
  imports: [MATERIAL_MODELO],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsultaFichaComponent {

  readonly dialogRef = inject(MatDialogRef<ConsultaFichaComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

}
