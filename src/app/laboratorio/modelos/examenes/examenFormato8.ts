export interface IFormato8 {
  examenFisico:IResultadoExamenFisicoFormato8 [];
  examenQuimico:IResultadoExamenQMFormato8 [];
  examenMicroscopico:IResultadoExamenQMFormato8 [];
  examenSimbologia:IResultadoExamenSimbologiaFormato8 [];
}

export interface IResultadoExamenFisicoFormato8  {
  parametro: string;
  resultado: string;
  flagNegrilla:boolean;
}

export interface IResultadoExamenQMFormato8  {
  parametro: string;
  resultado: string;
  unidad: string;
  flagNegrilla:boolean;
}

export interface IResultadoExamenSimbologiaFormato8  {
  nombre: string;
  simbolo: string;
  flagNegrilla:boolean;
}

