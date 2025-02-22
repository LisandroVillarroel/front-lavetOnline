import {
  Component,
  OnInit,
  Inject,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
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
];

@Component({
    selector: 'app-consulta-doctor-solicitante',
    templateUrl: './consulta-doctor-solicitante.component.html',
    styleUrls: ['./consulta-doctor-solicitante.component.scss'],
    imports: [MATERIAL_MODELO],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsultaDoctorSolicitanteComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ConsultaDoctorSolicitanteComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  constructor() {}

  ngOnInit() {}
}
