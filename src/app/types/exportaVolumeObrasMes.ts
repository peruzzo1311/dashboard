import Requisicao from './Requisicao';
import { Obras } from './exportaVolumeMeses';

export default interface ExportaVolumeObrasMes extends Requisicao {
  obras: Obras | Obras[];
}
