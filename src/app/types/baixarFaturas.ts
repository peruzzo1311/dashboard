import Requisicao from './Requisicao';

export default interface baixarFaturas extends Requisicao {
  pdfFat: string;
}
