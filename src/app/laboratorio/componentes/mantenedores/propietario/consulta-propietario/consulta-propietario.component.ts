import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IPropietario } from '@laboratorio/modelos/propietario-modelo';

const MATERIAL_MODELO = [
  MatInputModule,
  MatIconModule,
  MatDialogModule,
  MatButtonModule,
];

@Component({
  selector: 'app-consulta-propietario',
  templateUrl: './consulta-propietario.component.html',
  styleUrls: ['./consulta-propietario.component.scss'],
  imports: [MATERIAL_MODELO],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsultaPropietarioComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<ConsultaPropietarioComponent>);
  readonly data = inject<IPropietario>(MAT_DIALOG_DATA);

  constructor() { }

  ngOnInit() {
  }
}
