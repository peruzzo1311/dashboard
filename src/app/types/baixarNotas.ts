import Requisicao from './Requisicao';

export default interface baixarNotas extends Requisicao {
  pdfNfs: string;
}
