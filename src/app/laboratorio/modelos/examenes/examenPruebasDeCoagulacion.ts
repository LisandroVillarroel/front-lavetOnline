export interface IPruebasDeCoagulacion {
  resultado:IResultado[];
  observaciones: string;
}

export interface IResultado {
  parametro: string;
  unidad: string;
  resultado: string;
  caninos: string;
  felinos: string;
  flagNegrilla:boolean;
}
