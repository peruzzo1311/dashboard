import Requisicao from './Requisicao';

export default interface ExportaCotacoes extends Requisicao {
  cotacoes: Cotac[];
}

export interface Cotac {
  codMoe: string;
  vlrPre: number;
  desMoe: string;
  datGer: string;
  datMoe: string;
  vlrCot: number;
}
