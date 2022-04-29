import { orderlist } from './orderlist';
import { productionlist } from './productionlist';
import { qualitycontrol } from './qualitycontrol';
import { selldirect } from './selldirect';
import { sellwish } from './sellwish';
import { workingtimelist } from './workingtimelist';

export interface input {
  qualitycontrol: qualitycontrol;
  sellwish: sellwish;
  selldirect: selldirect;
  orderlist: orderlist;
  productionlist: productionlist;
  workingtimelist: workingtimelist;
}
