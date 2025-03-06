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
  resultado: IResultadoFormato2[];
}
export interface IResultadoFormato2 {
  nombreExamen: string;
  tipoEstructura: IListaTipoEstructura; //Titulo-Estructura
  estructura: IEstructuraFormato2Titulo;
}

export interface IEstructuraFormato2Titulo {
  nombreDescripcion: string;
  nombreResultado: string;
  estructuraDetalle: IEstructuraDetalleFormato2[];
}

export interface IEstructuraDetalleFormato2 {
  nombreDescripcion: string;
  tipoCampoResultado: IListaTipoCampoResultado; // string - float - lista
  cantidadDecimales: number;
  listaResultado: IListaResultadoFormato2[]; //lista solo si el tipoCampoResultado es lista
  unidadMedida: IListaUnidadMedida;
  flagNegrilla: boolean;
  formula: string;
  formulaInterna: string;
}

export interface IListaResultadoFormato2 {
  idLista: string;
  nombreLista: string;
}

export enum IListaTipoEstructura {
  'Titulo',
  'Estructura',
}

export enum IListaTipoCampoResultado {
  'string',
  'float',
  'lista',
}

export enum IListaUnidadMedida {
  '',
  'g/dl',
  'mg/dl',
  'mm3',
  '%',
}
