import Requisicao from './Requisicao';

export interface ExportaPagamentos extends Requisicao {
  titulo: [
    {
      vctPro: string;
      vlrAbe: number;
    }
  ];
}
