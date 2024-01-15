import Requisicao from './Requisicao';

export interface baixarNotas extends Requisicao {
  pdfNfe: string;
}

export interface baixarNotasXML extends Requisicao {
  xmlNfe: { string: string }[];
}
