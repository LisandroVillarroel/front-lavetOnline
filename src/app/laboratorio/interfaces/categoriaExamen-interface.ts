import { IExamen } from '@laboratorio/modelos/examen-modelo';

export interface ICategoriaExamenInterface {
  nombre: string;
  sigla: string;
  examen: IExamen[];
}
