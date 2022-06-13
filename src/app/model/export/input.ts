import { SellDirect } from './selldirect';
import { SellWish } from './sellwish';
import { orderlist } from './orderlist';
import { productionlist } from './productionlist';
import { qualitycontrol } from './qualitycontrol';
import { workingtimelist } from './workingtimelist';

export interface input {
  qualitycontrol: qualitycontrol;
  sellwish: SellWish;
  selldirect: SellDirect;
  orderlist: orderlist;
  productionlist: productionlist;
  workingtimelist: workingtimelist;
}
