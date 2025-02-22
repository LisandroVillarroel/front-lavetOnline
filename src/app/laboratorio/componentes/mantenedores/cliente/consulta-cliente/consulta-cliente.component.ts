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
  selector: 'app-consulta-cliente',
  templateUrl: './consulta-cliente.component.html',
  styleUrls: ['./consulta-cliente.component.scss'],
  imports: [MATERIAL_MODELO],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsultaClienteComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<ConsultaClienteComponent>);
  public readonly data = inject(MAT_DIALOG_DATA);

  constructor() {}

  ngOnInit() {}
}
