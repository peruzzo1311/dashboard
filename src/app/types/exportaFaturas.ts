import Requisicao from './Requisicao';

export default interface exportaFaturas extends Requisicao {
  faturas: Fatura[];
}

export interface Fatura {
  numNff: number;
  codCli: number;
  nomCli: string;
  codEmp: number;
  codFil: number;
  datGer: string;
  nomFil: string;
  vlrTot?: number;
  baixando?: boolean;
  notas: Nota | Nota[];
}

export interface Nota {
  numNfv: number;
  numDfs: number;
  desObr: string;
  codSnf: string;
  codEmp: number;
  vlrLiq: number;
  codFil: number;
  seqEnt: number;
  nomFil: string;
  baixando?: boolean;
}
