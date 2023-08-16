import Requisicao from './Requisicao';

export default interface ExportaTitulos extends Requisicao {
  titulos: Titulo[];
}

export interface Titulo {
  numNfv: number;
  numTit: string;
  vctPro: string;
  vlrOri: number;
  codEmp: number;
  vlrAbe: number;
  codFil: number;
  numNff: number;
  numPed: number;
  codCli: number;
  numDfs: number;
  nomCli: string;
  codTpt: string;
  vctOri: string;
  nomFil: string;
  baixando?: boolean;
}
