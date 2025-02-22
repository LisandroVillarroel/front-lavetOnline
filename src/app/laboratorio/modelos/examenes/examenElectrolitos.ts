export interface IElectrolitos {
  resultado:IResultadoElectrolitos[];
  observaciones: string;

}

export interface IResultadoElectrolitos {
  parametro: string;
  unidad: string;
  resultado: string;
  caninos: string;
  felinos: string;
  flagNegrilla:boolean;
}
