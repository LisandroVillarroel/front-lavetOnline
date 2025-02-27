export interface IFormato1 {
  resultadoEspecie: IResultadoEspecieFormato1[];
  subTitulo: string;
  observaciones: string;
}

export interface IResultadoEspecieFormato1 {
  especie_Id: string;
  resultado: IResultadoFormato1[];
}

export interface IResultadoFormato1 {
  _id?: string;
  ordenEstructura: number;
  descripcion: string;
  unidadMedida: string;
  resultado: string;
  referencia: string;
  logica: string;
  desde?: string;
  hasta?: string;
  flagNegrilla?: boolean;
  formula: string;
  formulaInterna: string;
}
