export interface IFormato5 {
  resultado:IResultadoDirectoDePeloYEscamaFormato5[];
  resultadoSimbologia:IResultadoSimbologiaFormato5[];
}

export interface IResultadoDirectoDePeloYEscamaFormato5 {
  nombre: string;
  resultado: string;
  flagNegrilla:boolean;
}

export interface IResultadoSimbologiaFormato5 {
  nombre: string;
  simbolo: string;
  flagNegrilla:boolean;
}
