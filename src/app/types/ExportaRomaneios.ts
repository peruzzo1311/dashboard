import Requisicao from './Requisicao';

export default interface ExportaRomaneios extends Requisicao {
  romaneios: Romaneio[];
}

export interface Romaneio {
  codFam: string;
  codMoe: string;
  codPro: string;
  codSaf: string;
  cplIpo: string;
  desFam: string;
  nomFor: string;
  qtdAbe: number;
  qtdCan: number;
  qtdPed: number;
  qtdRec: number;
  desPro: string;
}
