export interface IFormato2 {
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
