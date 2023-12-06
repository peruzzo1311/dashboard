import Requisicao from './Requisicao';

export interface baixarNotas extends Requisicao {
  pdfNfe: string;
}

export interface baixarNotasXml extends Requisicao {
  xmlNfe: [
    {
      string: string;
    }
  ];
}
