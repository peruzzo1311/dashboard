import Requisicao from './Requisicao';

export default interface exportaNotas extends Requisicao {
  notas: Nota | Nota[];
}

export interface Nota {
  numNfv: number;
  codCli: number;
  numDfs: number;
  nomCli: string;
  datAut: string;
  chvDoe: string;
  codSnf: string;
  codEmp: number;
  codFil: number;
  seqEnt: number;
  nomFil: string;
  baixando?: boolean;
  baixandoXML?: boolean;
}
