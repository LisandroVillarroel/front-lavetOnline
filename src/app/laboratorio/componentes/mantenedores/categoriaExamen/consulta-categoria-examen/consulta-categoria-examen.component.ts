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
  selector: 'app-consulta-categoria-examen',
  templateUrl: './consulta-categoria-examen.component.html',
  styleUrls: ['./consulta-categoria-examen.component.scss'],
  imports: [MATERIAL_MODELO],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsultaCategoriaExamenComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ConsultaCategoriaExamenComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  constructor() {}

  ngOnInit() {}
}
