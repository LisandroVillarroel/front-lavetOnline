export interface IFormato7 {
  examenFisico:string;
  resultado:IResultadoFormato7[];
  conclusion: string;
}

export interface IResultadoFormato7 {
  nombre: string;
  resultado: boolean;
  flagNegrilla:boolean;
}

