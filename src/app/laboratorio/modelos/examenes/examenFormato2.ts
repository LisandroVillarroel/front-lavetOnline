/*export interface IFormato2 {
  liquido: string;
  examenFisico:IResultadoFormato2[];
  examenQuimico:IResultadoFormato2[];
  examenCitologico:IResultadoFormato2[];
}

export interface IResultadoFormato2 {
  parametro: string;
  resultado: string;
  flagNegrilla:boolean;
}
*/
export interface IFormato2 {
  estructura: IResultadoFormato2[];
}

export interface IResultadoFormato2 {
  _id?: string;
  nombreExamen: string;
  resultadoNombreExamen: string;
  tipoEstructura: string; //Campo-Estructura
  nombreTituloDescripcion: string;
  nombreTituloResultado: string;
  estructuraDetalle: IEstructuraDetalleFormato2[];
}

export interface IEstructuraDetalleFormato2 {
  _id?: string;
  nombreDescripcion: string;
  tipoCampoResultado: string; // string(texto) - numerico(Número) - lista
  cantidadDecimales: number;
  listaResultado: IListaResultadoFormato2[]; //lista solo si el tipoCampoResultado es lista
  unidadMedida: string; //'',  'g/dl';  'mg/dl';  mm3;  '%';
  flagNegrilla: boolean;
  formula: string;
  formulaInterna: string;
}

export interface IListaResultadoFormato2 {
  _id?: string;
  nombreLista: string;
}
