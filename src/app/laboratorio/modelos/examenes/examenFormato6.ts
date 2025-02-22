export interface IFormato6 {
  serieRoja: IHemogramaSerieRojaFormato6[],
  serieBlanca: IHemogramaSerieBlancaFormato6[],
  totalSerieBlanca: number;
  observaciones: IObservacionesFormato6[]
}

export interface IHemogramaSerieRojaFormato6 {
  parametro: string;
  resultado: string;
  unidad: string;
  caninos: string;
  caninoDesde?:string;
  caninoHasta?:string;
  felinos: string;
  felinoDesde?:string;
  felinoHasta?:string;
  flagNegrilla:boolean;
}

export interface IHemogramaSerieBlancaFormato6 {
  parametro: string;
  resultadoPrc: string;
  resultadoNum: string;
  caninos: string;
  caninoDesde?:string;
  caninoHasta?:string;
  felinos: string;
  felinoDesde?:string;
  felinoHasta?:string;
  flagNegrilla:boolean;
}

export interface IObservacionesFormato6 {
  nombre: string;
  resultado: string;
  flagNegrilla: boolean;
}
