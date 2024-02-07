import Requisicao from './Requisicao';

export default interface ExportaContratos extends Requisicao {
  contratos: ContratoCompra[];
}

export interface ContratoCompra {
  numCtr: number;
  tipVlz: number;
  codEmp: number;
  codFil: number;
  codFor: number;
  qtdFor: number;
  codDep: string;
  codPro: string;
  codMoe: string;
  oriMer: number;
  preUni: number;
  codSaf: string;
  uniMed: string;
  datEmi: string;
  cplCcp: string;
}
