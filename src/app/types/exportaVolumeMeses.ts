import Requisicao from './Requisicao';

export default interface ExportaVolumeMeses extends Requisicao {
  meses: Meses[];
}

export interface Meses {
  ano: number;
  mes: number;
  obras: Obras[] | Obras;
}

export interface Obras {
  volMt3: number;
  desObr: string;
  codObr: number;
}
