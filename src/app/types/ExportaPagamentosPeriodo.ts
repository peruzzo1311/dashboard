import Requisicao from './Requisicao';

export default interface ExportaPagamentosPeriodo extends Requisicao {
  periodo: [
    {
      vlrAbe: number;
      descricao: string;
    }
  ];
}
