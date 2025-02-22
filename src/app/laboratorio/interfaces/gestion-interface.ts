
export interface IGestionGrafico {
            name: string;
            value: number;
}

export interface IGestionGeneral {
  valorAnualGeneralMesTotal: number;
  valorAnualGeneralTotal: number;
}


export interface IComparaAnterior {
    name: string;
    series: seriesI[];
  }

  export interface seriesI {
    name: string;
    value: number;
  }

  export interface IVentaExamen {
    name: string;
    series: seriesI[];
  }

  export interface IVentaDia {
    name: string;
    value: number;
  }

  export interface IVentaCliente {
    name: string;
    value: number;
  }
