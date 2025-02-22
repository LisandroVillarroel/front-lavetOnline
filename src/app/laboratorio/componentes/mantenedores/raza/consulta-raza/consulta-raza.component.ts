import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IRaza } from '@laboratorio/modelos/raza-modelo';

const MATERIAL_MODELO = [
  MatInputModule,
  MatIconModule,
  MatDialogModule,
  MatButtonModule,
];

@Component({
    selector: 'app-consulta-raza',
    templateUrl: './consulta-raza.component.html',
    styleUrls: ['./consulta-raza.component.scss'],
    imports: [MATERIAL_MODELO],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsultaRazaComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ConsultaRazaComponent>);
  readonly data = inject<IRaza>(MAT_DIALOG_DATA);

  constructor() { }

  ngOnInit() { }
}
