import { STORE_DEFAULT_NAME } from '../constants';
import getStoreData from './getBrowserStoreData';
import { MiddleWare, GlobalState } from '../types';

class StoreFactory {
  public storageType: Storage;
  public store: GlobalState | undefined = undefined;
  public middleWares: MiddleWare[] = [];

  constructor(public name = STORE_DEFAULT_NAME) {
    this.storageType =
      typeof sessionStorage !== 'undefined'
        ? window.sessionStorage
        : ({} as Storage);
  }

  updateStore(defaultValues: GlobalState) {
    this.store = getStoreData(this.storageType, this.name) || defaultValues;
  }

  updateMiddleWares(middleWares: MiddleWare[]) {
    return (this.middleWares = middleWares);
  }
}

export default new StoreFactory();