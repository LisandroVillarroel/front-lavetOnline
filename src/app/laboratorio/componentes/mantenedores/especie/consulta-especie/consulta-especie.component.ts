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

const MATERIAL_MODELO = [
  MatInputModule,
  MatIconModule,
  MatDialogModule,
  MatButtonModule,
];

@Component({
    selector: 'app-consulta-especie',
    templateUrl: './consulta-especie.component.html',
    styleUrls: ['./consulta-especie.component.scss'],
    imports: [MATERIAL_MODELO],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsultaEspecieComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ConsultaEspecieComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  constructor() {}

  ngOnInit() {}
}
