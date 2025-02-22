import { IResultadoFormato1 } from "@laboratorio/modelos/examenes/examenFormato1";

export interface IExamenEstructura {
  // id_Examen: string,
  indice?: number,
  maximoEstructura?: number,
  resultado: IResultadoFormato1[],
}
