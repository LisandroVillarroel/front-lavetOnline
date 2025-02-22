export interface IFormato10 {
  resultado:IResultadoFormato10[];
  subTitulo:string;
  total:string;
  observaciones: string;

}

export interface IResultadoFormato10 {
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
